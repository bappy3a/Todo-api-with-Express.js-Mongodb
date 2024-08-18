const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const userSchema = require('../schemas/userSchema');

const User = new mongoose.model('User', userSchema);

router.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            message: 'User successfully register!',
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (isValidPassword) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        userId: user._id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' },
                );
                res.status(401).json({ access_tokne: token, message: 'Login successful!' });
            } else {
                res.status(401).json({ message: 'Password Not Mas' });
            }
        } else {
            res.status(401).json({ error: 'Opps!! Login Faile!!' });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
