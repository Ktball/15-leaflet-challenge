// Create the map 
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

//Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//function to determine depth of earthquake based on color
//this code was shown to us in class by teacher
function getColor(depth) {
  switch (true) {
    case depth < 10: return "#b1f57d"; //green
    case depth < 30: return "#f5f59d"; //yellow
    case depth < 50: return "#f5d99d"; //light orange
    case depth < 70: return "#f2c35c"; // orange
    case depth < 90: return "#ba881c"; //dark orange
    case depth >= 90: return "#eb3434"; //red
    default: return "#34cfeb";
  }
};

 // legend.addTo(myMap); 
 //help on 1 portion of the legend from Ask BCS Learning tutor.  I was able to get the legend and 
 //depth ranges to appear but needed help getting the colors to appear
let legend = L.control({
  position: "bottomright"
});

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  let depthRanges = [-10, 10, 30,50, 70, 90];
  let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

  // Looping through our intervals to generate a label with a colored square for each interval.
  for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          depthRanges[i] + (depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] + "<br>" : "+");
  }
  return div;
};

legend.addTo(myMap);
let legendStyle = document.createElement('style');
legendStyle.innerHTML = `
    .info.legend {
        background-color: white;
        padding: 10px;
        border: 1px solid black;
        font: 12px/14px Arial, sans-serif;
    }
    .info.legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }
    .info.legend br {
        clear: both;
    }
`;
document.getElementsByTagName('head')[0].appendChild(legendStyle);


// get the geoJSON 
d3.json(url).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(eqData) {
  L.geoJSON(eqData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: Math.sqrt(feature.properties.mag) * 5,
        color: "#000",
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        opacity: 1,
        weight: 0.5
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${layer.feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p>`);
    }
  }).addTo(myMap);
}











