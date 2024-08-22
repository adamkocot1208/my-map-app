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
    // Dodaj inne przypadki w razie potrzeby
  }
}

//-----inicjalizacja mapy------------------------------------------------------------------------//
var map = L.map("map").setView([49.64, 19.12], 12);

//---dodanie warstw-----------------------------------------------------------------------------//

// warstwy podkładu
var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var osmHOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  }
);

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

// definicje stylu
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

//usuwanie wszystkiego z mapy
map.removeLayer(trainStationsAndStopsLayer);
map.removeLayer(trainLinesLayer);
map.removeLayer(balonsPhysographicAreasLayer);
