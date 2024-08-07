function setCookie(name, value, days, sameSite = 'Lax') {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const sameSiteAttr = "SameSite=" + sameSite;
    document.cookie = name + "=" + value + ";" + expires + ";path=/;" + sameSiteAttr;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function isLoggedIn(token) {
    return token !== null && token !== '';
}

function handleLogin(token) {
    if (isLoggedIn(token)) {
        window.location.href = '/map';
    } else {
        window.location.href = '/login';
    }
}

function handleRegister(token) {
    if (isLoggedIn(token)) {
        window.location.href = '/map';
    } else {
        window.location.href = '/register';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    //formularze
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const messageForm = document.getElementById('messageForm');

    //przyciski
    const logoutButton = document.getElementById('logoutButton');
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
                        setCookie('token', data.token, 1, 'None; Secure');
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

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const token = getCookie('token');
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                const data = await response.json();
                alert(data.msg);
                eraseCookie('token');
                window.location.href = '/';
            } catch (err) {
                console.error('Error:', err);
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const token = getCookie('token');
                handleLogin(token);
            } catch (err) {
                window.location.href = '/login';
            }
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const token = getCookie('token');
                handleRegister(token);
            } catch (err) {
                window.location.href = '/register';
            }
        });
    }

});