/*
  Control.Zoom.debug.js
  This is wrapping the L.Control.Zoom class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var ControlZoomDebug = L.DebugClass.extend({
    // The name of the class being wrapped with a debug
    _className: "L.Control.Zoom",
    initialize: function(controlZoom) {
        // Calling the baseinit
        this.baseinit(controlZoom);
        this.controlZoom = controlZoom;
        this.map = controlZoom.map;
    },
    dumpOptions: function() {
        for (var key in this.controlZoom.options) {
            console.log(key + " - " + this.controlZoom.options[key]);
        }
        return Object.keys(this.controlZoom.options).length;
    }
});

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.Control.Zoom.addInitHook(function () {
        L.debug.add(this);
        this.debug = new ControlZoomDebug(this);
    });
    return {className:"L.Control.Zoom",classRef:L.Control.Zoom};
};
