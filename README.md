# Autonomous Comment Moderation
Welcome to our efficient and rapid comment moderation system, designed to seamlessly sort comments into two distinct categories: those that are entirely clean and those that may necessitate manual moderation. The categorization process is based on an in-depth analysis of the comment's content, the user's email, and the user's username.

## Usage
```js
const moderation = require(...)

// Rate a comment for moderation
const commentRating = moderation.rate('The comment content', 'User Name', 'user@email.com');
// The commentRating is a value between 0 and 100.

// Typically, any rating under 100 should be flagged for manual review. However, you can customize the threshold as per your requirements.
```

Feel free to adjust the threshold according to your specific needs for a more tailored moderation experience.
