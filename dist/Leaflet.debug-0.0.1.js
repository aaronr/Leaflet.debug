;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
	Leaflet.debug, a plugin that adds some basic debug functions
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

	https://github.com/aaronr/Leaflet.debug
*/
'use strict';

var debug = require('./debug/Debug')();
debug.init([

// Lets add in all the different modules we are adding onto

//map
require('./map/Map.debug')(),

// control
require('./control/Control.Zoom.debug')(),

// layer
require('./layer/tile/TileLayer.debug')()

]);

L.debug = module.exports = debug;


},{"./control/Control.Zoom.debug":2,"./debug/Debug":3,"./layer/tile/TileLayer.debug":5,"./map/Map.debug":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
/*
  Map.debug.js
  This is wrapping the L.Map class with .debug

	(c) 2013, Aaron Racicot, Z-Pulley Inc.
*/
'use strict';

var MapDebug = L.Class.extend({
    // The name of the class being wrapped with a debug
    _className: "L.Map",
    _map: null,
    initialize: function(map) {
        this._map = map;
    },
    numLayers: function() {
        return Object.keys(this._map._layers).length;
    }
});

// This is the generic hook into the testing system for this 
// object type.
module.exports = function() {
    L.Map.addInitHook(function () {
        L.debug.add(this);
        this.debug = new MapDebug(this);
    });
    return {className:"L.Map",classRef:L.Map};
};

},{}]},{},[1,2,3,4,5,6])
;