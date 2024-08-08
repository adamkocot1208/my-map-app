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

    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

    // Define layer groups
    var trainStationsAndStopsLayer = L.layerGroup();
    var trainLinesLayer = L.layerGroup();
    var balonsPhysographicAreasLayer = L.layerGroup();

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
    
// point - stacje i przystanki
fetch('/api/trainStationsAndStops')
.then(response => response.json())
.then(data => {
    if (Array.isArray(data)) {
        data.forEach(station => {
            let marker;
            if (station.railway === 'stacja') {
                marker = L.marker([station.latitude, station.longitude], { icon: stationIcon }).addTo(trainStationsAndStopsLayer);
            } else if (station.railway === 'przystanek') {
                marker = L.marker([station.latitude, station.longitude], { icon: stopIcon }).addTo(trainStationsAndStopsLayer);
            } else {
                marker = L.marker([station.latitude, station.longitude], { icon: nonStopIcon }).addTo(trainStationsAndStopsLayer);
            }

            marker.bindPopup(`<i>${station.railway}:</i> <span style="font-weight: bold;">${station.name}</span>`);
        });
    } else {
        console.error('Expected an array but received:', data);
    }
})
.catch(error => console.error('Error fetching train stations and stops:', error));


// line - linie kolejowe
fetch('/api/trainLines')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(trainLine => {
                    trainLine.coordinates.forEach(line => {
                        const lineCoordinates = line.map(coord => [coord[1], coord[0]]);
                        
                        let elektr;
                        let polyline;
                        if (trainLine.elektr == 1){
                            polyline = L.polyline(lineCoordinates, { color: 'black' }).addTo(trainLinesLayer);
                            elektr = 'TAK'
                        } else {
                            polyline = L.polyline(lineCoordinates, { color: 'grey' }).addTo(trainLinesLayer);
                            elektr = 'NIE'
                        }

                        polyline.bindPopup(`
                            <i>Nr linii:</i> <span style="font-weight: bold;">${trainLine.nr}</span><br>
                            <i>Elektryfikacja:</i> <span style="font-weight: bold;">${elektr}</span>
                        `);
                    });
                });
            } else {
                console.error('Expected an array but received:', data);
            }
        })
        .catch(error => console.error('Error fetching train lines:', error));

// poligony - podzial fizjograficzny Balona
fetch('/api/balonsPhysographicAreas')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(area => {
                        area.coordinates.forEach(polygon => {
                            const coordinates = polygon.map(ring => ring.map(coord => [coord[1], coord[0]]));
                            let polygonLayer;
                            if (area.layer == 'gory'){
                                polygonLayer = L.polygon(coordinates, { color: 'black'}).addTo(balonsPhysographicAreasLayer);
                            } else if (area.layer == 'kotliny_miedzygorza_obnizenia'){
                               polygonLayer = L.polygon(coordinates, { color: 'red'}).addTo(balonsPhysographicAreasLayer);
                            } else if (area.layer == 'pogorza'){
                                polygonLayer = L.polygon(coordinates, { color: 'yellow'}).addTo(balonsPhysographicAreasLayer);
                            }

                            polygonLayer.bindPopup(`<span style="font-weight: bold;">${area.name}</span>`)
                        });
                    });
            } else {
                console.error('Expected an array but received:', data);
            }
        })
        .catch(error => console.error('Error fetching balonsPhysographicAreas:', error));

    // Layer control
    trainStationsAndStopsLayer.addTo(map);
    trainLinesLayer.addTo(map);
    balonsPhysographicAreasLayer.addTo(map);

});
