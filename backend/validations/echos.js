const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateEchoInput = [
    check('title')
        .exists({ checkFalsy: true })
        .isLength({ min: 5, max: 40 })
        .withMessage('Title must be between 5 and 40 characters'),
    // check(req.file)
    //     .withMessage('Recording must be included in an Echo'),
    handleValidationErrors
];

module.exports = validateEchoInput;