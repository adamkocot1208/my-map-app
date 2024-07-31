const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const verifyToken = require('../utils/verifyToken');
const emailService = require('../utils/emailService');

exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (await User.findByEmail(email) || await User.findByUsername(username)) {
            return res.status(400).json({ msg: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(email, username, hashedPassword);

        const token = generateToken(user.id);
        const confirmationLink = `http://localhost:3000/activate/${token}`; //adres do zmiany
        await emailService.sendActivationEmail(email, confirmationLink);

        res.status(201).json({ msg: 'User registered successfully. Please check your email to activate your account.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.activateAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const { userId } = verifyToken(token);
        await User.confirmUser(userId);
        res.status(200).json({ msg: 'Account activated successfully' });
    } catch (error) {
        res.status(400).json({ msg: 'Invalid token' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = generateToken(user.id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const token = generateToken(user.id);
        const resetLink = `http://localhost:3000/reset-password/${token}`; //adres do zmiany
        await emailService.sendPasswordResetEmail(email, resetLink);
        res.status(200).json({ msg: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const { userId } = verifyToken(token);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(userId, hashedPassword);
        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ msg: 'Invalid token' });
    }
};
