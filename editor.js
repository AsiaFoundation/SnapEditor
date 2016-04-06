$(function() {
  var osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; 2016 OpenStreetMap contributors',
  });

  var map = L.map('map', { drawControl: true })
    .setView([48.49, 1.4], 16)
    .addLayer(osm);

  var makePolyline = function(selection) {
    var coordinates = selection.geometry.coordinates[0];
    for (var pt = 0; pt < coordinates.length; pt++) {
      coordinates[pt].reverse();
    }
    //coordinates.pop();
    return coordinates;
  };

  $.getJSON('data/sample.geojson', function (data) {
    var selection = data.features.splice(Math.floor(Math.random() * data.features.length), 1)[0];

    var guideLayers = [];
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
        //var coordinates = makePolyline(json);
        //var border = L.polyline(coordinates).addTo(map);
        guideLayers.push(layer);
      }
    }).addTo(map);

    var coordinates = makePolyline(selection);
    var editingPolygon = L.polyline(coordinates).addTo(map);
    editingPolygon.snapediting = new L.Handler.PolylineSnap(map, editingPolygon);
    for (var a = 0; a < guideLayers.length; a++) {
      editingPolygon.snapediting.addGuideLayer(guideLayers[a]);
    }
    editingPolygon.snapediting.enable();

    guideLayers.push(editingPolygon);

    map.drawControl.setDrawingOptions({
      polyline: { guideLayers: guideLayers },
      polygon: { guideLayers: guideLayers },
      marker: false,
      rectangle: false,
      circle: false
    });

    map.fitBounds( baselayer.getBounds() );
  });
});
