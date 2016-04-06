$(function() {
  var osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; 2016 OpenStreetMap contributors',
  });

  var map = L.map('map')
    .setView([48.49, 1.4], 16)
    .addLayer(osm);

  $.getJSON('data/sample.geojson', function (data) {
    var selection = data.features.splice(Math.floor(Math.random() * data.features.length), 1);
    var layer = L.geoJson(selection);
    var lgroup = L.featureGroup([layer]).addTo(map);

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
      }
    }).addTo(map);

    var drawControl = new L.Control.Draw({
      draw: false,
      edit: {
        featureGroup: lgroup
      }
    });
    map.addControl(drawControl);

    // layer.snapediting = new L.Handler.PolylineSnap(map, layer);
    // layer.snapediting.addGuideLayer(baselayer);
    // layer.snapediting.enable();

    map.fitBounds( baselayer.getBounds() );
  });
});
