const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateEchoInput = [
    check('text')
        .exists({ checkFalsy: true })
        .isLength({ min: 5, max: 140 })
        .withMessage('Echo must be between 5 and 140 characters'),
    handleValidationErrors
];

module.exports = validateEchoInput;