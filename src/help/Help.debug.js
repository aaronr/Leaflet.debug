/*
  Help.debug.js
	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var Help = L.Class.extend({
    initialize: function() {
        var a = 1+1;
    },
    show: function() {
        var help = "" +
            "Leaflet.debug... the shizzle for pimping your Leaflet map!\n" +
            "----------------------------------------------------------\n" +
            "Maybe some command docs could go here?\n" +
            "-----------------------------------------------------------\n";
        return help;
    }
});

module.exports = function() {
    return new Help();
};
