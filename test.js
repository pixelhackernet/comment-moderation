const moderation = require('./index')

const tests = [
    {
        name: 'John Doe',
        email: 'johndoe@pixelhacker.net',
        comment: 'This is a controll comment, to test the rate system.'
    },
    {
        name: 'Slag hunter',
        email: 'hunter@yopmail.net',
        comment: 'Im going to hunt all these slags'
    },
    {
        name: 'SkankHunt42',
        email: 'gerald@sp.ca',
        comment: 'Fuck you, retard!' // Should return 0 due to hardban word
    }
]

for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`testing ${i}, rate:`, moderation.rate(test.comment, test.name, test.email))
}