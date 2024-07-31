const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/activate/:token', authController.activateAccount);
router.post('/login', authController.login);
router.post('/send-password-reset-email', authController.sendPasswordResetEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
