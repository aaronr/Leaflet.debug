var map;
$(document).ready(function() {
    map = L.mapbox.map('map', 'reprojected.g9on3k93').setView([0, 0], 3);
    poly = new L.Polygon( new L.LatLng( 0,0 ), new L.LatLng( 0,1 ), new L.LatLng( 1,1 ),new L.LatLng( 1,0 ), new L.LatLng( 0, 0 ) );
    poly.toInheritString();

    var lyrs = map.listTileLayers();
    var lyrs = map.listVectorLayers();
    var lyrs = map.listMarkerLayers();
    var lyrs = map.listGroupLayers();

    console.log( map.getLayerByID( 20 ) );
    console.log( map.getLayerByRef( map.getLayerByID( 20 ) ) );
});
