/*
	Leaflet.debug, a plugin that adds some basic debug functions
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

	https://github.com/aaronr/Leaflet.debug
*/
'use strict';

// L overrides
require('./overrides.js');

var debug = require('./debug/Debug')();
L.debug = debug;

// Lets add in all the different modules we are adding onto

//map
require('./map/Map.debug')();

// control
require('./control/Control.Zoom.debug')();

// layer
require('./layer/tile/TileLayer.debug')();

module.exports = debug;

