let map;
let data = {};
let currentCity = "";
let routeLayers = [];
let markers = [];

// INIT
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/data")
    .then(res => res.json())
    .then(res => {
      data = res;
      initMap();
      loadCities();
      document.getElementById("routeBtn").onclick = drawRoute;
    });
});

// MAP (Attractive style)
function initMap() {
  map = L.map("map").setView([17.385, 78.4867], 7);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap & Carto"
  }).addTo(map);
}

// LOAD CITIES
function loadCities() {
  const citySelect = document.getElementById("citySelect");
  const cities = Object.keys(data).sort();

  cities.forEach(city => {
    citySelect.add(new Option(city, city));
  });

  currentCity = cities[0];
  citySelect.value = currentCity;

  loadPlaces();

  citySelect.onchange = () => {
    currentCity = citySelect.value;
    loadPlaces();
  };
}

// LOAD PLACES
function loadPlaces() {
  const from = document.getElementById("fromPlace");
  const to = document.getElementById("toPlace");

  from.innerHTML = "";
  to.innerHTML = "";

  const places = Object.keys(data[currentCity].places).sort();

  places.forEach(p => {
    from.add(new Option(p, p));
    to.add(new Option(p, p));
  });
}

// CLEAR
function clearMap() {
  routeLayers.forEach(r => map.removeLayer(r));
  markers.forEach(m => map.removeLayer(m));
  routeLayers = [];
  markers = [];
}

// DRAW ROUTE
async function drawRoute() {
  const from = document.getElementById("fromPlace").value;
  const to = document.getElementById("toPlace").value;

  if (!from || !to || from === to) {
    alert("Select different places");
    return;
  }

  const fromCoords = data[currentCity].places[from];
  const toCoords = data[currentCity].places[to];

  const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson&alternatives=true`;

  const res = await fetch(url);
  const json = await res.json();

  clearMap();

  json.routes.forEach((route, index) => {

    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

    const traffic = Math.floor(Math.random() * 100);
    const color = traffic < 40 ? "#00c853" : traffic < 70 ? "#ff9800" : "#ff1744";

    // glow effect
    const shadow = L.polyline(coords, {
      color: "#000",
      weight: 10,
      opacity: 0.2
    }).addTo(map);

    const poly = L.polyline(coords, {
      color: index === 0 ? "#2962ff" : color,
      weight: index === 0 ? 6 : 4
    }).addTo(map);

    routeLayers.push(poly, shadow);

    poly.bindPopup(`
      <b>Route ${index + 1}</b><br>
      Distance: ${(route.distance / 1000).toFixed(2)} km<br>
      Time: ${(route.duration / 60).toFixed(1)} mins<br>
      Traffic: ${traffic}%
    `);

    if (index === 0) {
      map.fitBounds(poly.getBounds(), { padding: [50, 50] });

      document.getElementById("routeInfo").innerHTML = `
        <b>🚗 Best Route</b><br>
        Distance: ${(route.distance / 1000).toFixed(2)} km<br>
        Time: ${(route.duration / 60).toFixed(1)} mins
      `;
    }
  });

  // markers
  markers.push(
    L.marker(fromCoords).addTo(map).bindPopup("Start: " + from),
    L.marker(toCoords).addTo(map).bindPopup("End: " + to)
  );
}
