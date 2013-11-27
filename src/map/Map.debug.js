/*
  Map.debug.js
  This is wrapping the L.Map class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var MapDebug = L.DebugClass.extend({
    // The name of the class being wrapped with a debug
    _className: "L.Map",
    initialize: function(map) {
        this.baseinit(map);
        this.map = map;
    },
    numLayers: function() {
        return Object.keys(this.map._layers).length;
    }
});

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    //L.Map.addInitHook(function () {
    //    L.debug.add(this);
    //    //this.debug = new MapDebug(this);
    //});
    return {className:"L.Map",classRef:L.Map};
};
