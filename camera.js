//Pan the camera...

function move(id){
  switch (id) {
    case "1":
          var root = 'http://359bcamera1.cmix.louisiana.edu/axis-cgi/com/ptz.cgi?move=left';
          break;
    case "2":
          var root = 'http://359bcamera1.cmix.louisiana.edu/axis-cgi/com/ptz.cgi?move=right';
          break;
    case "3":
          var root = 'http://359bcamera1.cmix.louisiana.edu/axis-cgi/com/ptz.cgi?move=up';
          break;
    case "4":
          var root = 'http://359bcamera1.cmix.louisiana.edu/axis-cgi/com/ptz.cgi?move=down';
          break;
    default:
    break;
  }
  $.ajax({
    url: root,
    method: 'GET'
  });

};



// Icon features on map..
var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([-92.020621, 30.210636])),
  name: 'Lafayette Camera',
  population: 127626
});

//Icon styles on map...
var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: 'Camera.png',
    scale: 0.08
  }))
});

iconFeature.setStyle(iconStyle);

//Icon feature updated on vector source...
var vectorSource = new ol.source.Vector({
  features: [iconFeature]
});

//Vector source updated on Vector Layer...
var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
    source: new ol.source.OSM()
  }),vectorLayer],
  target: document.getElementById('map'),
  view: new ol.View({
    center: ol.proj.fromLonLat([-92.020621, 30.210636]),
    zoom: 5
    })
});

var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50]
});

map.addOverlay(popup);

//Display popup on click...

map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature) {
        return feature;
      });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': feature.get('name')
    });
    $(element).popover('show');
    document.getElementById("side_pane").style.display = "block";
  } else {
      $(element).popover('destroy');
      document.getElementById("side_pane").style.display = "none";
  }
});

// change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(element).popover('destroy');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
