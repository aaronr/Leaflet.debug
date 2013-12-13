/*
  TileLayer.debug.js
  This is wrapping the L.TileLayer class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var dumpOptions = function() {
        for (var key in this.parent.options) {
            console.log(key + " - " + this.parent.options[key]);
        }
        return Object.keys(this.parent.options).length;
};

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.debug.extendClass("L.TileLayer",{"myTestVar":"foo",
                                  "dumpOptions": dumpOptions
                                 });
    return;
};
