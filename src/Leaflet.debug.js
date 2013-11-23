/*
	Leaflet.debug, a plugin that adds some basic debug functions
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

	https://github.com/aaronr/Leaflet.debug
*/
'use strict';

var modules = [];
// Lets add in all the different modules we are adding onto
modules = modules.concat(require('./map/Map.debug')());

modules = modules.concat(require('./control/Control.Zoom.debug')());





///////////////////////////////////////////////////////////
// This is some stuff to keep track of all the classes and 
// instances that are being tracked.
///////////////////////////////////////////////////////////
L.debug = module.exports = {
    VERSION: require('../package.json').version,
    _help: require('./help/Help.debug')(),
    _activeClasses: []
};
L.debug.help = L.debug._help.show;
// Make tracking places for all the types we are wrapping
for (var i=0;i<modules.length;i++) {
    L.debug._activeClasses.push({n:modules[i].className,c:modules[i].classRef,instances:[]});
}
// Add method used by all the debug classes to keep track of active instances
L.debug.add = function (mysteryClass){
    for (var i=0;i<L.debug._activeClasses.length;i++) {
        if (mysteryClass instanceof L.debug._activeClasses[i].c) {
            // Need to push the instance so we can keep track of it
            L.debug._activeClasses[i].instances.push(mysteryClass);
        }
    };
};
L.debug.active = function () {
    if (arguments.length == 0) {
        console.log("Class - #Instances");
        console.log("------------------");
        for (var i=0;i<L.debug._activeClasses.length;i++) {
            console.log(L.debug._activeClasses[i].n + " - " + L.debug._activeClasses[i].instances.length);
        } 
        return "";
    } else {
        // We have class names and loop through and return the instance
        // refs for those objects
        var instanceList = [];
        for (var i=0;i<arguments.length;i++) {
            for (var ii=0;ii<L.debug._activeClasses.length;ii++) {
                if (arguments[i] === L.debug._activeClasses[ii].n) {
                    for (var iii=0;iii<L.debug._activeClasses[ii].instances.length;iii++) {
                        instanceList.push({"className":arguments[i], 
                                           "classRef":L.debug._activeClasses[ii].instances[iii]});
                    }
                }
            }
        }
        return instanceList;
    }
}
