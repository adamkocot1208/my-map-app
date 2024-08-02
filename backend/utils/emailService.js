const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendActivationEmail = async (email, activationLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Activation',
        text: `Click the following link to activate your account: ${activationLink} \n This link is only valid for 10 minutes`
    };
    await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink} \n This link is only valid for 10 minutes`
    };
    await transporter.sendMail(mailOptions);
};

exports.sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};