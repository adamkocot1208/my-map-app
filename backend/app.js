require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/authRoutes');
const mapRoutes = require('./routes/mapRoutes');

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/', mapRoutes);

// Serve specific HTML files for login, register, reset password, and set new password
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});

app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'reset-password.html'));
});

app.get('/set-new-password', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'set-new-password.html'));
});

app.get('/activate', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'activate.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'map.html'));
});

app.get('/panorama', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'panorama.html'));
});

app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'help.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'contact.html'));
});

// Catch-all handler to serve the main frontend file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
