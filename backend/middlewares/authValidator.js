const { check, validationResult } = require('express-validator');

exports.validateRegister = [
    check('email', 'Invalid email').isEmail(),
    check('username', 'Username must be between 3 and 30 characters').isLength({ min: 3, max: 30 }),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
