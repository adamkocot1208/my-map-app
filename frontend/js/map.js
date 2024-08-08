document.addEventListener('DOMContentLoaded', function() {
    var mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';

    var bannerSection = document.getElementById('banner');
    var boxAlt = bannerSection.querySelector('.box.alt');
    boxAlt.innerHTML = ''; // Clear the placeholder text
    boxAlt.appendChild(mapContainer);

    var map = L.map('map').setView([49.64,19.12], 12);

    // warstwy podkładu

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    /*    const orthophotoLayer = L.tileLayer.wmts('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution', {
            layer: 'Raster',
            style: 'default',
            tilematrixSet: 'EPSG:2180',
            format: 'image/png',
            attribution: '&copy; Geoportal'
          });*/

    // warstwy z danymi

// Fetch and display train stations and stops
fetch('/api/trainStationsAndStops')
.then(response => response.json())
.then(data => {
    if (Array.isArray(data)) {
        data.forEach(station => {
            let marker;
            if (station.railway === 'stacja') {
                marker = L.marker([station.latitude, station.longitude], { icon: stationIcon }).addTo(map);
            } else if (station.railway === 'przystanek') {
                marker = L.marker([station.latitude, station.longitude], { icon: stopIcon }).addTo(map);
            } else {
                // Default marker if railway type is not recognized
                marker = L.marker([station.latitude, station.longitude], { icon: nonStopIcon }).addTo(map);
            }

            marker.bindPopup(`<i>${station.railway}:</i> <span style="font-weight: bold;">${station.name}</span>`);
        });
    } else {
        console.error('Expected an array but received:', data);
    }
})
.catch(error => console.error('Error fetching train stations and stops:', error));

 // definicje stylu
 const stationIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:black; width:12px; height:12px; border-radius: 50%;'></div>",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const stopIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:white; width:12px; height:12px; border:2px solid black; border-radius: 50%;'></div>",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

const nonStopIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:grey; width:12px; height:12px; border:2px solid black; border-radius: 50%;'></div>",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});


});
