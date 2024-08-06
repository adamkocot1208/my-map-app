const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const verifyToken = require('../utils/verifyToken');
const emailService = require('../utils/emailService');
const path = require('path');

exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const existingUserByEmail = await User.findByEmail(email);
        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByEmail) {
            return res.status(400).json({ msg: `Email already exists to ${email}` });
        }
        if (existingUserByUsername) {
            return res.status(400).json({ msg: `Username already exists on ${username}` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(email, username, hashedPassword);

        const token = generateToken(user.id, '15m');
        const confirmationLink = `http://localhost:5000/api/auth/activate/${token}`;
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
        res.redirect('/activate');
    } catch (error) {
        res.status(400).json({ msg: 'Invalid token' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (!user.confirmed) {
            return res.status(403).json({ msg: 'Please activate your account to log in.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = generateToken(user.id);
        await User.updateLastLogged(user.id, token);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    const { token } = req.body; 
    try {
        const { userId } = verifyToken(token);
        await User.updateLastLogged(userId, null);
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    const { username, email } = req.body;

    try {
        const existingUserByUsername = await User.findByUsername(username);
        if (!existingUserByUsername){
            res.status(400).json({ msg: 'User not found' });
        }
        if (existingUserByUsername) {
            const user = await User.findByUsername(username);
            const token = generateToken(user.id, '10m');
            const resetLink = `http://localhost:5000/set-new-password?token=${token}`;
            await emailService.sendPasswordResetEmail(email, resetLink);
            res.status(200).json({ msg: `Password reset email sent to ${user.email}` });
        }
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

exports.sendMessage = async (req, res) => {
    const { email, surname, topic, message } = req.body;
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        await emailService.sendEmail(
            adminEmail,
            `New message from ${surname}`,
            `Email: ${email}\nTopic: ${topic}\nMessage: ${message}`
        );
        await emailService.sendEmail(
            email,
            'Your message has been received',
            `${surname} thank you for contacting us. We have received your message:\n\nTopic: ${topic}\nMessage: ${message}\n\nWe will get back to you soon.`
        );
        res.status(200).json({ msg: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
