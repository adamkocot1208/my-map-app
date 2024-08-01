document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

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
                        window.location.href = 'map.html';
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
            const email = document.getElementById('email').value;

            const emailError = document.getElementById('emailError');
            emailError.textContent = '';

            try {
                const response = await fetch('/api/auth/send-password-reset-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.errors) {
                        data.errors.forEach(error => {
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
});
