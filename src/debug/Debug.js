/*
	Debug, core of the debug shizzle
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

*/
'use strict';
var help = require('../help/Help.debug')();

// Base class for all class debug 
L.ClassDebug = L.Class.extend({
    baseinit: function(obj) {
        this._obj = obj;
    },
    toInheritString: function() {
        var self = this._obj.__name === 'L.Class' ? {} : this._obj.constructor.__super__;
        //var self = this._obj; // don't overwrite this ref
        var class_name_lookup = [];
        if ((typeof this._className !== 'undefined' && 
             typeof self.__name !== 'undefined') && 
            (this._className !== self.__name)) {
            class_name_lookup.push( this._className || "" )
        }
        while ( typeof self.__name !== 'undefined' ) {
            class_name_lookup.push( self.__name || "" );
            self = self.__name === 'L.Class' ? {} : self.constructor.__super__;
        }
        return class_name_lookup.join( ' => ' );
    }
});

var Debug = L.Class.extend({
    // The name of the Debug class
    _className: "Debug",
    _activeInstances: [],
    init: function(modules) {
        // Make tracking places for all the types we are wrapping
        for (var i=0;i<modules.length;i++) {
            this._activeInstances.push({n:modules[i].className,c:modules[i].classRef,instances:[]});
        }
        // Go ahead and brand all the Leaflet Classes with names so we can 
        // make call chains for the users...
        for (var thisClass in L) {
            if (L[thisClass].hasOwnProperty("prototype")) {
                L[thisClass].prototype.__name = "L."+thisClass;
            }
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
    },
    events: function () {
        if (arguments.length == 0) {
            var eventsList = [];
            for (var i=0;i<this._activeInstances.length;i++) {
                console.log("++++++++++++++++++");
                console.log(this._activeInstances[i].n);
                console.log("------------------");
                var typeList = {"class":this._activeInstances[i].n,"instances":[]};
                // Loop through each instance
                for (var ii=0;ii<this._activeInstances[i].instances.length;ii++) {
                    // Loop through each event type
                    var instanceList = {"instance":this._activeInstances[i].instances[ii],"events":[]};
                    if (this._activeInstances[i].instances[ii].hasOwnProperty("_leaflet_events")) {
                        for (var key in this._activeInstances[i].instances[ii]._leaflet_events) {
                            if (/_idx$/.test(key)) {
                                console.log(key + " - " + 
                                            this._activeInstances[i].instances[ii]._leaflet_events[key+"_len"]);
                                instanceList.events.push({"event":key, 
                                                          "eventRefs":this._activeInstances[i].instances[ii]._leaflet_events[key], 
                                                          "num":this._activeInstances[i].instances[ii]._leaflet_events[key+"_len"]
                                                         });
                            }
                        }
                    } else {
                        console.log("** No events **");
                    }
                    if (ii > 0) {
                        console.log("------------------");
                    }
                    typeList.instances.push(instanceList);
                }
                eventsList.push(typeList);
            } 
            return eventsList;
        }
        return "";
    }

});

// This is the generic hook into the testing system 
module.exports = function() {
    return new Debug();
};

