document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage on login
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
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
});


document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Add additional Leaflet functionalities...
});
