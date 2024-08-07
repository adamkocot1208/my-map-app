document.addEventListener('DOMContentLoaded', function() {
    var mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';

    var bannerSection = document.getElementById('banner');
    var boxAlt = bannerSection.querySelector('.box.alt');
    boxAlt.innerHTML = ''; // Clear the placeholder text
    boxAlt.appendChild(mapContainer);

    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
});
