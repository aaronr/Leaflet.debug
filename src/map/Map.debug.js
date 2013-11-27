/*
  Map.debug.js
  This is wrapping the L.Map class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var numLayers = function() {
    var numLayers = Object.keys(this.parent._layers).length;
    console.log("Num Layers = " + numLayers);
    return numLayers;
};

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.debug.extend("L.Map",{"myTestVar":"foo",
                            "numLayers": numLayers
                           });
    return;
};
