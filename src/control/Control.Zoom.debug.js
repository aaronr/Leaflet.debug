/*
  Control.Zoom.debug.js
  This is wrapping the L.Control.Zoom class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var ControlZoomDebug = L.Class.extend({
    // The name of the class being wrapped with a debug
    _className: "L.Control.Zoom",
    _controlZoom: null,
    _map: null,
    initialize: function(controlZoom) {
        this._map = controlZoom._map;
        this._controlZoom = controlZoom;
    },
    dumpOptions: function() {
        for (var key in this._controlZoom.options) {
            console.log(key + " - " + this._controlZoom.options[key]);
        }
        return Object.keys(this._controlZoom.options).length;
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
