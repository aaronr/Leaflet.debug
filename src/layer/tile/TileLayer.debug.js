/*
  TileLayer.debug.js
  This is wrapping the L.TileLayer class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var TileLayerDebug = L.DebugClass.extend({
    // The name of the class being wrapped with a debug
    _className: "L.TileLayer",
    initialize: function(tileLayer) {
        this.baseinit(tileLayer);
        this.tileLayer = tileLayer;
    },
    dumpOptions: function() {
        for (var key in this.tileLayer.options) {
            console.log(key + " - " + this.tileLayer.options[key]);
        }
        return Object.keys(this.tileLayer.options).length;
    }
});

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    //L.TileLayer.addInitHook(function () {
    //    L.debug.add(this);
    //    //this.debug = new TileLayerDebug(this);
    //});
    return {className:"L.TileLayer",classRef:L.TileLayer};
};
