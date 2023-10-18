const Filter = require('bad-words');
const Mailchecker = require('mailchecker');

const filter = new Filter();
const hardBan = require('./hardBan.json')

/**
 * Rate the given input and return a number between 0 and 100.
 * @param {string} comment - The comment to be rated.
 * @param {string} name - The name associated with the comment.
 * @param {string} email - The email associated with the comment.
 * @returns {number} A rating between 0 and 100, indicating the likelihood of the input being spam or fake.
 */
function rate (comment, name, email) {
    let score = 100;

    // Moderate comment
    
    const regex = /(?<=\s|^)(\*+)(?=\s|$)/g;
    const filtered = filter.clean(comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim());

    const originalMatches = comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim().match(regex);
    const cleanedMatches = filtered.match(regex);

    if (cleanedMatches) {
        const astriFound = originalMatches !== null ? originalMatches.length : 0
        score -= ((cleanedMatches.length - astriFound) * 10)
    }

    const words = comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim().split(' ');
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (hardBan.includes(word.toLowerCase())) {
            return 0;
        }
    }

    // Moderate email

    if (!Mailchecker.isValid(email)) {
        score -= 30
    }

    // Moderate name

    const filteredName = filter.clean(name)
    const originalName = name.match(regex);
    const cleanedName = filteredName.match(regex);

    if (cleanedName) {
        const astriFound = originalName !== null ? originalName.length : 0
        if ((cleanedName.length - astriFound) > 0) score -= 40;
    }

    return score;
}

// If the score is any lower than 100 it should be manualy checked
module.exports = { rate }
