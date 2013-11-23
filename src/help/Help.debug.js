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
        console.log("Help!");
    }
});
var help = function () {
    return new Help();
};

module.exports = function() {
    return help();
};
