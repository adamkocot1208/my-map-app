//--- funkcje ------------------------------------------------------------------------//

// Funkcja do przełączania widoczności podwarstw
function toggleSubLayers(layerId, mainLayerCheckbox) {
  var subLayers = document.getElementById(layerId);

  if (subLayers) {
    // Pokaż/ukryj podwarstwy
    if (subLayers.style.display === "none") {
      subLayers.style.display = "block";
    } else {
      subLayers.style.display = "none";
    }

    // Zaznacz/odznacz wszystkie checkboxy podrzędnych warstw
    var checkboxes = subLayers.getElementsByTagName("input");
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = mainLayerCheckbox.checked;
      toggleLayer(checkboxes[i].id, checkboxes[i]);
    }
  }
}

// Funkcja do przełączania widoczności warstw
function toggleLayer(layerName, checkbox) {
  if (checkbox.checked) {
    // Dodaj warstwę do mapy
    addLayerToMap(layerName);
  } else {
    // Usuń warstwę z mapy
    removeLayerFromMap(layerName);
  }
}

// Funkcja do dodawania warstwy do mapy (do zdefiniowania wg Twojej logiki)
function addLayerToMap(layerName) {
  switch (layerName) {
    case "subLayer3_1":
      map.addLayer(trainStationsAndStopsLayer);
      break;
    case "subLayer3_2":
      map.addLayer(trainLinesLayer);
      break;
    case "subLayer4_1":
      map.addLayer(balonsPhysographicAreasLayer);
      break;
    case "subLayer99_1":
      map.addLayer(hipso);
      break;
    case "subLayer99_2":
      map.addLayer(cieniowanie);
      break;
    // Dodaj inne przypadki w razie potrzeby
  }
}

// Funkcja do usuwania warstwy z mapy (do zdefiniowania wg Twojej logiki)
function removeLayerFromMap(layerName) {
  switch (layerName) {
    case "subLayer3_1":
      map.removeLayer(trainStationsAndStopsLayer);
      break;
    case "subLayer3_2":
      map.removeLayer(trainLinesLayer);
      break;
    case "subLayer4_1":
      map.removeLayer(balonsPhysographicAreasLayer);
      break;
    case "subLayer99_1":
      map.removeLayer(hipso);
      break;
    case "subLayer99_2":
      map.removeLayer(cieniowanie);
      break;
    // Dodaj inne przypadki w razie potrzeby
  }
}

//-------definicja ukladu-----------------------------------------------------------------------//
proj4.defs(
  "EPSG:2180",
  "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs"
);

var crs = new L.Proj.CRS(
  "EPSG:2180",
  "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs",
  {}
);

//-----inicjalizacja mapy------------------------------------------------------------------------//
var map = L.map("map").setView([49.64, 19.12], 12);

//---dodanie warstwy podkładu-------------//
var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var orto = L.tileLayer.projwmts(
  "https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution",
  {
    format: "image/jpeg",
    tileSize: 512,
    version: "1.0.0",
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [
      30238155.714285716, 15119077.857142858, 7559538.928571429,
      3779769.4642857146, 1889884.7321428573, 944942.3660714286,
      472471.1830357143, 236235.59151785716, 94494.23660714286,
      47247.11830357143, 23623.559151785714, 9449.423660714287,
      4724.711830357143, 1889.8847321428573, 944.9423660714286,
      472.4711830357143,
    ],
    tilematrixSet: "EPSG:2180",
    crossOrigin: true,
    minZoom: 5,
    attribution:
      '&copy; <a href="https://geoportal.gov.pl/">Główny Urząd Geodezji i Kartografii</a> contributors',
  }
);

var topo = L.tileLayer.projwmts(
  "https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/TOPO",
  {
    format: "image/jpeg",
    tileSize: 512,
    version: "1.0.0",
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [
      7559538.928571429, 3779769.4642857146, 1889884.7321428573,
      944942.3660714286, 472471.1830357143, 236235.59151785716,
      94494.23660714286, 47247.11830357143, 23623.559151785714,
      9449.423660714287, 4724.711830357143, 1889.8847321428573,
      944.9423660714286,
    ],
    tilematrixSet: "EPSG:2180",
    crossOrigin: true,
    minZoom: 5,
    attribution:
      '&copy; <a href="https://geoportal.gov.pl/">Główny Urząd Geodezji i Kartografii</a> contributors',
  }
);

var google_terrain = L.tileLayer(
  "http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "&copy; Google contributors",
  }
);

new L.basemapsSwitcher(
  [
    {
      layer: osm.addTo(map), //DEFAULT MAP
      icon: "./images/mapLayer_img1.PNG",
      name: "OpenStreetMap",
    },
    {
      layer: orto,
      icon: "./images/mapLayer_img2.PNG",
      name: "Ortofotomapa",
    },
    {
      layer: topo,
      icon: "./images/mapLayer_img3.PNG",
      name: "Mapa topograficzna",
    },
    {
      layer: google_terrain,
      icon: "./images/mapLayer_img4.PNG",
      name: "GM Teren",
    },
  ],
  { position: "bottomleft" }
).addTo(map);

var hipso = L.tileLayer.projwmts(
  "https://mapy.geoportal.gov.pl/wss/service/PZGIK/NMT/GRID1/WMTS/HypsometryAndShadedRelief",
  {
    format: "image/jpeg",
    tileSize: 512,
    version: "1.0.0",
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [
      7559538.928571429, 3779769.4642857146, 1889884.7321428573,
      944942.3660714286, 472471.1830357143, 236235.59151785716,
      94494.23660714286, 47247.11830357143, 23623.559151785714,
      9449.423660714287, 4724.711830357143, 1889.8847321428573,
      944.9423660714286,
    ],
    tilematrixSet: "EPSG:2180",
    crossOrigin: true,
    minZoom: 5,
    attribution:
      '&copy; <a href="https://geoportal.gov.pl/">Główny Urząd Geodezji i Kartografii</a> contributors',
  }
);

var cieniowanie = L.tileLayer.projwmts(
  "https://mapy.geoportal.gov.pl/wss/service/PZGIK/NMT/GRID1/WMTS/ShadedRelief",
  {
    format: "image/jpeg",
    tileSize: 512,
    version: "1.0.0",
    transparent: true,
    crs: crs,
    origin: [850000.0, 100000.0],
    scales: [
      7559538.928571429, 3779769.4642857146, 1889884.7321428573,
      944942.3660714286, 472471.1830357143, 236235.59151785716,
      94494.23660714286, 47247.11830357143, 23623.559151785714,
      9449.423660714287, 4724.711830357143, 1889.8847321428573,
      944.9423660714286,
    ],
    tilematrixSet: "EPSG:2180",
    crossOrigin: true,
    minZoom: 5,
    attribution:
      '&copy; <a href="https://geoportal.gov.pl/">Główny Urząd Geodezji i Kartografii</a> contributors',
  }
);

//---dodanie warstw wektorowych-----------//

// point - stacje i przystanki
var trainStationsAndStopsLayer = L.layerGroup();

fetch("/api/trainStationsAndStops")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      data.forEach((station) => {
        let marker;
        if (station.railway === "stacja") {
          marker = L.marker([station.latitude, station.longitude], {
            icon: stationIcon,
          }).addTo(trainStationsAndStopsLayer);
        } else if (station.railway === "przystanek") {
          marker = L.marker([station.latitude, station.longitude], {
            icon: stopIcon,
          }).addTo(trainStationsAndStopsLayer);
        } else {
          marker = L.marker([station.latitude, station.longitude], {
            icon: nonStopIcon,
          }).addTo(trainStationsAndStopsLayer);
        }

        marker.bindPopup(
          `<i>${station.railway}:</i> <span style="font-weight: bold;">${station.name}</span>`
        );
      });
    } else {
      console.error("Expected an array but received:", data);
    }
  })
  .catch((error) =>
    console.error("Error fetching train stations and stops:", error)
  );

// line - linie kolejowe
var trainLinesLayer = L.layerGroup();

fetch("/api/trainLines")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      data.forEach((trainLine) => {
        trainLine.coordinates.forEach((line) => {
          const lineCoordinates = line.map((coord) => [coord[1], coord[0]]);

          let elektr;
          let polyline;
          if (trainLine.elektr == 1) {
            polyline = L.polyline(lineCoordinates, { color: "black" }).addTo(
              trainLinesLayer
            );
            elektr = "TAK";
          } else {
            polyline = L.polyline(lineCoordinates, { color: "grey" }).addTo(
              trainLinesLayer
            );
            elektr = "NIE";
          }

          polyline.bindPopup(`
                            <i>Nr linii:</i> <span style="font-weight: bold;">${trainLine.nr}</span><br>
                            <i>Elektryfikacja:</i> <span style="font-weight: bold;">${elektr}</span>
                        `);
        });
      });
    } else {
      console.error("Expected an array but received:", data);
    }
  })
  .catch((error) => console.error("Error fetching train lines:", error));

// poligony - podzial fizjograficzny Balona
var balonsPhysographicAreasLayer = L.layerGroup();

fetch("/api/balonsPhysographicAreas")
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      data.forEach((area) => {
        area.coordinates.forEach((polygon) => {
          const coordinates = polygon.map((ring) =>
            ring.map((coord) => [coord[1], coord[0]])
          );
          let polygonLayer;
          if (area.layer == "gory") {
            polygonLayer = L.polygon(coordinates, { color: "black" }).addTo(
              balonsPhysographicAreasLayer
            );
          } else if (area.layer == "kotliny_miedzygorza_obnizenia") {
            polygonLayer = L.polygon(coordinates, { color: "red" }).addTo(
              balonsPhysographicAreasLayer
            );
          } else if (area.layer == "pogorza") {
            polygonLayer = L.polygon(coordinates, { color: "yellow" }).addTo(
              balonsPhysographicAreasLayer
            );
          }

          polygonLayer.bindPopup(
            `<span style="font-weight: bold;">${area.name}</span>`
          );
        });
      });
    } else {
      console.error("Expected an array but received:", data);
    }
  })
  .catch((error) =>
    console.error("Error fetching balonsPhysographicAreas:", error)
  );

//---definicje stylu----------------------//
const stationIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:black; width:12px; height:12px; border-radius: 50%;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const stopIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:white; width:12px; height:12px; border:2px solid black; border-radius: 50%;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const nonStopIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:grey; width:12px; height:12px; border:2px solid black; border-radius: 50%;'></div>",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

//---kolejnosc wyświetlania warstw--------//
hipso.setZIndex(2);
cieniowanie.setZIndex(1);

//---transparentnosc warstw---------------//
const transparencyCollection = {
  OpenStreetMap: osm,
  Ortofotomapa: orto,
  "Mapa topograficzna": topo,
  "Google Terrain": google_terrain,
  Hipsometria: hipso,
  Cieniowanie: cieniowanie,
};

L.control
  .opacity(transparencyCollection, {
    label: "Poziom przezroczystości",
  })
  .addTo(map);

//---usuwanie wszystkiego z mapy----------//
map.removeLayer(trainStationsAndStopsLayer);
map.removeLayer(trainLinesLayer);
map.removeLayer(balonsPhysographicAreasLayer);
