exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Username is required').notEmpty();
    // req.check('phone', 'phone must be between 13 to 13 characters')
    //     // .matches(/^\d{14}$/)
    //     .withMessage('Email must contain +')
    //     .isLength({
    //         min: 13,
    //         max: 13
    //     });
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};