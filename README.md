# Autonomous Comment Spam Rating (acpr)
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


## Configuration Options

This script offers a high degree of customization, making it highly modular to suit various use cases. To adapt it to your specific needs, there are several key configuration variables available. By default, the script is optimized for use with https://pixelhacker.net.

- **Scoring**: Customize the scoring for each flag to meet your requirements. You can modify these values in the [`scores.json`](scores.json) file.

- **Thresholds**: Some checks may have predefined thresholds. If you wish to adjust these thresholds, you can do so in the [`thresholds.json`](thresholds.json) file.

- **Hard Banned Words**: Caution is advised when accessing this file, as it contains extremely offensive words that will result in a complete ban (0 score). If you need to manage these words, you can find them in the [`hardwords.json`](hardwords.json) file.
