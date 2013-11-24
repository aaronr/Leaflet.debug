/*
	Leaflet.debug, a plugin that adds some basic debug functions
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

	https://github.com/aaronr/Leaflet.debug
*/
'use strict';

var debug = require('./debug/Debug')();
debug.init([

// Lets add in all the different modules we are adding onto
require('./map/Map.debug')(),
require('./control/Control.Zoom.debug')()

]);

L.debug = module.exports = debug;

