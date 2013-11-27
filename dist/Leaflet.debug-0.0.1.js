;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
	Leaflet.debug, a plugin that adds some basic debug functions
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

	https://github.com/aaronr/Leaflet.debug
*/
'use strict';

var debug = require('./debug/Debug')();
L.debug = debug;

// Lets add in all the different modules we are adding onto

//map
require('./map/Map.debug')();

// control
require('./control/Control.Zoom.debug')();

// layer
require('./layer/tile/TileLayer.debug')();

module.exports = debug;


},{"./control/Control.Zoom.debug":2,"./debug/Debug":3,"./layer/tile/TileLayer.debug":5,"./map/Map.debug":6}],2:[function(require,module,exports){
/*
  Control.Zoom.debug.js
  This is wrapping the L.Control.Zoom class with .debug

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
    L.debug.extend("L.Control.Zoom",{"myTestVar":"foo",
                                     "dumpOptions": dumpOptions
                                    });
    return;
};

},{}],3:[function(require,module,exports){
/*
	Debug, core of the debug shizzle
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

*/
'use strict';
var help = require('../help/Help.debug')();

// Base class for all class debug 
L.DebugClass = L.Class.extend({
    initialize: function(name, classRef) {
        this.name = name;
        this._obj = classRef;
    },
    toInheritString: function() {
        var self = this._obj;
        var classNameLookup = [];
        classNameLookup.push(this.name);
        while ( self.__super__.hasOwnProperty("debug") ) {
            classNameLookup.push(self.__super__.debug.name);
            self = this._obj.__super__.debug._obj;
        }
        // The last one is an "L.Class"
        classNameLookup.push("L.Class");
        return classNameLookup.join( ' => ' );
    }
});

var Debug = L.Class.extend({
    // The name of the Debug class
    _className: "Debug",
    _activeInstances: [],
    _tagClasses: function(baseClass) {
        var baseClassName = null;
        if (baseClass === L) {
            baseClassName = "L";
        } else if (baseClass.hasOwnProperty("prototype") &&
                   baseClass.prototype.hasOwnProperty("debug")) {
            baseClassName = baseClass.prototype.debug.name;
        } else {
            // If we cant seem to match it up we bail
            return;
        }
        for (var thisClass in baseClass) {
            var shouldWeCare = !(/^Debug.*|^Class.*/.test(thisClass)) &&
                (/^[A-Z].*/.test(thisClass)) && 
                (baseClass[thisClass].hasOwnProperty("prototype")) &&
                ((baseClass === L) || (baseClass[thisClass].hasOwnProperty("__super__") && 
                                       baseClass.hasOwnProperty("prototype") &&
                                       (baseClass[thisClass].__super__ === baseClass.prototype)));
            if (shouldWeCare) {
                baseClass[thisClass].prototype.debug = new L.DebugClass(baseClassName+"."+thisClass,baseClass[thisClass]);
                this._activeInstances.push({n:baseClass[thisClass].prototype.debug.name,
                                            c:baseClass[thisClass],
                                            instances:[]});
                if (baseClass[thisClass].hasOwnProperty("addInitHook")) {
                    baseClass[thisClass].addInitHook(function () {
                        L.debug.add(this);
                    });
                }
                this._tagClasses(baseClass[thisClass]);
            }
        }        
    },
    init: function() {
        // Go ahead and brand all the Leaflet Classes with names so we can 
        // make call chains for the users...
        this._tagClasses(L);
    },
    extend: function(name, options) {
        for (var i=0;i<this._activeInstances.length;i++) {
            if (name === this._activeInstances[i].n) {
                L.extend(this._activeInstances[i].c.prototype.debug, options);
            }
        }        
    },
    help: help.show(),
    // Add method used by all the debug classes to keep track of active instances
    add: function (mysteryClass){
        var name = mysteryClass.debug !== "undefined" ? mysteryClass.debug.name : null;
        if (name) {
            for (var i=0;i<this._activeInstances.length;i++) {
                if (name === this._activeInstances[i].n) {
                    // Need to push the instance so we can keep track of it
                    mysteryClass.debug.parent = mysteryClass;
                    this._activeInstances[i].instances.push(mysteryClass);
                }
            }
        } else {
            alert("We have a problem");
        }
    },
    active: function () {
        var instanceList = {};
        if (arguments.length == 0) {
            console.log("Class - #Instances");
            console.log("------------------");
            for (var i=0;i<this._activeInstances.length;i++) {
                if (this._activeInstances[i].instances.length) {
                    console.log(this._activeInstances[i].n + " - " + this._activeInstances[i].instances.length);
                    instanceList[this._activeInstances[i].n] = {"class":this._activeInstances[i].n, 
                                                                "instances":this._activeInstances[i].instances};
                } 
            }
            return instanceList;
        } else {
            // We have class names and loop through and return the instance
            // refs for those objects
            for (var i=0;i<arguments.length;i++) {
                for (var ii=0;ii<this._activeInstances.length;ii++) {
                    if (arguments[i] === this._activeInstances[ii].n) {
                        instanceList[arguments[i]] = {"class":arguments[i], 
                                                      "instances":[]};
                        for (var iii=0;iii<this._activeInstances[ii].instances.length;iii++) {
                            instanceList[arguments[i]].instances.push(this._activeInstances[ii].instances[iii]);
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
                            } else if (!/_len$/.test(key)) {
                                console.log("Non-standard event found! - " + key);
                            }
                        }
                    } else {
                        console.log("** Instance Found - No events list **");
                    }
                    if (ii > 0) {
                        console.log("------------------");
                    }
                    typeList.instances.push(instanceList);
                }
                if (ii == 0) {
                    console.log("** Instance Found - No events in list **");
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
    var debug = new Debug();
    debug.init();
    return debug;
};


},{"../help/Help.debug":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
    L.debug.extend("L.TileLayer",{"myTestVar":"foo",
                                  "dumpOptions": dumpOptions
                                 });
    return;
};

},{}],6:[function(require,module,exports){
/*
  Map.debug.js
  This is wrapping the L.Map class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var numLayers = function() {
    var numLayers = Object.keys(this.parent._layers).length;
    console.log("Num Layers = " + numLayers);
    return numLayers;
};

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.debug.extend("L.Map",{"myTestVar":"foo",
                            "numLayers": numLayers
                           });
    return;
};

},{}]},{},[1,2,3,4,5,6])
;