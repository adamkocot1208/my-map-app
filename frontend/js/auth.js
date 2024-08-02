document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const logoutButton = document.getElementById('logoutButton');
    const messageForm = document.getElementById('messageForm');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    if (registerForm) {
        registerForm.reset();
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const emailError = document.getElementById('emailError');
            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');

            emailError.textContent = '';
            usernameError.textContent = '';
            passwordError.textContent = '';

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors) {
                        data.errors.forEach(error => {
                            if (error.param === 'email') emailError.textContent = error.msg;
                            if (error.param === 'username') usernameError.textContent = error.msg;
                            if (error.param === 'password') passwordError.textContent = error.msg;
                        });
                    } else {
                        alert(data.msg);
                    }
                } else {
                    alert(data.msg);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (loginForm) {
        loginForm.reset();
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');

            usernameError.textContent = '';
            passwordError.textContent = '';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors) {
                        data.errors.forEach(error => {
                            if (error.param === 'username') usernameError.textContent = error.msg;
                            if (error.param === 'password') passwordError.textContent = error.msg;
                        });
                    } else {
                        alert(data.msg);
                    }
                } else {
                    if (data.msg === 'Please activate your account to log in.') {
                        alert(data.msg);
                    } else {
                        localStorage.setItem('token', data.token);
                        window.location.href = '/map';
                    }
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.reset();
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;

            const usernameError = document.getElementById('usernameError');
            const emailError = document.getElementById('emailError');
            usernameError.textContent = '';
            emailError.textContent = '';

            try {
                const response = await fetch('/api/auth/send-password-reset-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors) {
                        data.errors.forEach(error => {
                            if (error.param === 'username') usernameError.textContent = error.msg;
                            if (error.param === 'email') emailError.textContent = error.msg;
                        });
                    } else {
                        alert(data.msg);
                    }
                } else {
                    alert(data.msg);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (newPasswordForm) {
        newPasswordForm.reset();
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            newPasswordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = document.getElementById('password').value;

                const passwordError = document.getElementById('passwordError');
                passwordError.textContent = '';

                try {
                    const response = await fetch('/api/auth/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token, newPassword: password })
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        if (data.errors) {
                            data.errors.forEach(error => {
                                if (error.param === 'password') passwordError.textContent = error.msg;
                            });
                        } else {
                            alert(data.msg);
                        }
                    } else {
                        alert(data.msg);
                        window.location.href = '/login.html';
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            });
        } else {
            alert('Invalid or missing token');
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                const data = await response.json();
                alert(data.msg);
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/';
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (messageForm) {
        messageForm.reset();
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const surname = document.getElementById('surname').value;
            const topic = document.getElementById('topic').value;
            const message = document.getElementById('message').value;

            const emailError = document.getElementById('emailError');
            const surnameError = document.getElementById('surnameError');
            const topicError = document.getElementById('topicError');
            const messageError = document.getElementById('messageError');
            emailError.textContent = '';
            surnameError.textContent = '';
            topicError.textContent = '';
            messageError.textContent = '';

            try {
                const response = await fetch('/api/auth/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, surname, topic, message })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors) {
                        data.errors.forEach(error => {
                            if (error.param === 'email') emailError.textContent = error.msg;
                            if (error.param === 'surname') surnameError.textContent = error.msg;
                            if (error.param === 'topic') topicError.textContent = error.msg;
                            if (error.param === 'message') messageError.textContent = error.msg;
                        });
                    } else {
                        alert(data.msg);
                    }
                } else {
                    alert(data.msg);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }
});