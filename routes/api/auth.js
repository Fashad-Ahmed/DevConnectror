const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const normalize = require('normalize-url');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req, res) => {
    try {

        // only returning User Id minusing the password.
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth
// @desc    Authentication and user token / get the token and make requests to private routes
// @access  Public

router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters.').exists()
    ],
    async (req, res) => {
        // console.log(req.body)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // compare normal and encerypted passwords

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),         // {expiresIn: 36000000}
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server error.')

        }
    });


module.exports = router