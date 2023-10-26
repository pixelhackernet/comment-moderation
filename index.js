'use strict';

const Filter = require('bad-words');
const Mailchecker = require('mailchecker');
const filter = new Filter();
const hardwords = require('./hardwords.json')
const scores = require('./scores.json')
const thresholds = require('./thresholds.json')
const similarity = require('similarity')

/**
 * Checks the comment for spammed words
 * @param {string} comment - The comment to be checked.
 * @returns {boolean} Has it been flagged.
 */
function wordSpam(comment) {
    const wordRegex = /\b(\w+)\b/g;
    const words = comment.match(wordRegex);
    
    if (!words) return false;
    
    const wordCount = {};
    const threshold = Math.ceil(words.length / thresholds.wordSpamCount);
    
    for (const word of words) {
        if (wordCount[word]) {
            wordCount[word]++;
            if (wordCount[word] >= threshold) {
                return true;
            }
        } else {
            wordCount[word] = 1;
        }
    }
    
    return false;
}

/**
 * Checks the name for offensive content
 * @param {string} name - The name to be checked.
 * @returns {boolean} Has it been flagged.
 */
function nameOffensive(name) {
    const regex = /(?<=\s|^)(\*+)(?=\s|$)/g;

    const filteredName = filter.clean(name)
    const originalName = name.match(regex);
    const cleanedName = filteredName.match(regex);

    if (cleanedName) {
        const astriFound = originalName !== null ? originalName.length : 0
        return (cleanedName.length - astriFound) > 0;
    }
}

/**
 * Checks the comment for hardbanned words
 * @param {string} comment - The comment to be checked.
 * @returns {boolean} Has it been flagged.
 */
function hardBanned(comment) {
    const words = comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim().split(' ');
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        for (let x = 0; x < hardwords.length; x++) {
            const hardword = hardwords[x];
            if (similarity(word.toLowerCase(), hardword.toLowerCase()) >= thresholds.wordSimilarity) {
                return true
            }

        }
    }
    return false
}


/**
 * Rate the given input and return a number between 0 and 100.
 * @param {string} comment - The comment to be rated.
 * @param {string} name - The name associated with the comment.
 * @param {string} email - The email associated with the comment.
 * @returns {number} A rating between 0 and 100, indicating the likelihood of the input being spam or fake.
 */
function rate (comment, name, email) {
    let score = 100;

    // Moderate comment for bad words
    const regex = /(?<=\s|^)(\*+)(?=\s|$)/g;
    const filtered = filter.clean(comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim());

    const originalMatches = comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim().match(regex);
    const cleanedMatches = filtered.match(regex);

    if (cleanedMatches) {
        const astriFound = originalMatches !== null ? originalMatches.length : 0
        score -= ((cleanedMatches.length - astriFound) * scores.perBadWord)
    }


    if (hardBanned(comment)) return 0;
    if (!Mailchecker.isValid(email)) score -= scores.emailInvalid; // Email is not valid
    if (nameOffensive(name)) score -= scores.badwordInName; // Name is offensive
    if (wordSpam(comment.toLocaleLowerCase())) score -= scores.wordSpam; // Words are reused

    const words = comment.replace(/[^\w\s]/g, ' ').replace(/ +/g, ' ').trim().split(' ');
    if (words.length <= thresholds.minimumWords) score -= scores.minimumWords;

    return score;
}

module.exports = { rate }
