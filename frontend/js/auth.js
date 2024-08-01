document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

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
});

document.addEventListener("DOMContentLoaded", function() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordForm = document.getElementById('newPasswordForm');

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
                        window.location.href = '/login';
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            });
        } else {
            alert('Invalid or missing token');
        }
    }
});
