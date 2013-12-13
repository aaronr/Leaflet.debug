var map;
var apikey = window.location.hostname.indexOf('hostedFutureURL') !== -1 ? 'reprojected.g9on3k93' : 'examples.map-9ijuk24y';
$(document).ready(function() {
    map = L.mapbox.map('map', apikey).setView([0, 0], 3);
});
