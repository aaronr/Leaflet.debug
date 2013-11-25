/*
  TileLayer.debug.js
  This is wrapping the L.TileLayer class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var TileLayerDebug = L.Class.extend({
    // The name of the class being wrapped with a debug
    _className: "L.TileLayer",
    _tileLayer: null,
    initialize: function(tileLayer) {
        this._tileLayer = tileLayer;
    },
    dumpOptions: function() {
        for (var key in this._tileLayer.options) {
            console.log(key + " - " + this._tileLayer.options[key]);
        }
        return Object.keys(this._tileLayer.options).length;
    }
});

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.TileLayer.addInitHook(function () {
        L.debug.add(this);
        this.debug = new TileLayerDebug(this);
    });
    return {className:"L.TileLayer",classRef:L.TileLayer};
};
