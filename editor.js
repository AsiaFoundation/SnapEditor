$(function() {
  var osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; 2016 OpenStreetMap contributors',
  });

  var map = L.map('map', { drawControl: true })
    .setView([48.49, 1.4], 16)
    .addLayer(osm);

  var plotCoordinates = function(coordinates) {
    if (typeof coordinates[0] === 'number') {
      L.rectangle([[coordinates[1] - 0.0001, coordinates[0] - 0.0001], [coordinates[1] + 0.0001, coordinates[0] + 0.0001]],
        {
          fillColor: "#ff7800",
          fillOpacity: 1,
          weight: 0
        }
      ).addTo(map);
    } else {
      for (var c = 0; c < coordinates.length; c++) {
        plotCoordinates(coordinates[c]);
      }
    }
  };

  $.getJSON('data/sample.geojson', function (data) {
    var selection = data.features.splice(Math.floor(Math.random() * data.features.length), 1);
    var baselayer = L.geoJson(data, {
      style: function() {
        var r = Math.floor(Math.random() * 200);
        var g = Math.floor(Math.random() * 200);
        var b = Math.floor(Math.random() * 200);
        return {
          fillColor: 'rgb(' + [r,g,b].join(',') + ')',
          fillOpacity: 0.5,
          weight: 0,
          clickable: false
        };
      },
      onEachFeature: function(json, layer) {
        plotCoordinates(json.geometry.coordinates);
      }
    }).addTo(map);

    var guideLayers = [baselayer];

    map.drawControl.setDrawingOptions({
      polyline: { guideLayers: guideLayers, snapDistance: 25 },
      polygon: { guideLayers: guideLayers, snapDistance: 25 },
      marker: false,
      rectangle: false,
      circle: false
    });

    map.on('draw:created', function (e) {
      var layer = e.layer;
      map.addLayer(layer);
      guideLayers.push(layer);
    });

    map.fitBounds( baselayer.getBounds() );
  });
});
