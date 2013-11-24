/*
	Debug, core of the debug shizzle
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

*/
'use strict';
var help = require('../help/Help.debug')();
var Debug = L.Class.extend({
    // The name of the Debug class
    _className: "Debug",
    _activeInstances: [],
    init: function(modules) {
        // Make tracking places for all the types we are wrapping
        for (var i=0;i<modules.length;i++) {
            this._activeInstances.push({n:modules[i].className,c:modules[i].classRef,instances:[]});
        }
    },
    help: help.show(),
    // Add method used by all the debug classes to keep track of active instances
    add: function (mysteryClass){
        for (var i=0;i<this._activeInstances.length;i++) {
            if (mysteryClass instanceof this._activeInstances[i].c) {
                // Need to push the instance so we can keep track of it
                this._activeInstances[i].instances.push(mysteryClass);
            }
        };
    },
    active: function () {
        if (arguments.length == 0) {
            console.log("Class - #Instances");
            console.log("------------------");
            for (var i=0;i<this._activeInstances.length;i++) {
                console.log(this._activeInstances[i].n + " - " + this._activeInstances[i].instances.length);
            } 
            return "";
        } else {
            // We have class names and loop through and return the instance
            // refs for those objects
            var instanceList = [];
            for (var i=0;i<arguments.length;i++) {
                for (var ii=0;ii<this._activeInstances.length;ii++) {
                    if (arguments[i] === this._activeInstances[ii].n) {
                        for (var iii=0;iii<this._activeInstances[ii].instances.length;iii++) {
                            instanceList.push({"class":arguments[i], 
                                               "instance":this._activeInstances[ii].instances[iii]});
                        }
                    }
                }
            }
            return instanceList;
        }
    }
});

// This is the generic hook into the testing system 
module.exports = function() {
    return new Debug();
};

