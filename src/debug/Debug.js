/*
	Debug, core of the debug shizzle
	(c) 2013, Aaron Racicot, Z-Pulley Inc.

*/
'use strict';
//var $$ = require('jquery-browserify'); 
var help = require('../help/Help.debug')();
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/template/debug.html');
var js = fs.readFileSync(__dirname + '/template/debug.js');
var jq = fs.readFileSync(__dirname + '/template/jquery.min.js');

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
    extendClass: function(name, options) {
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
    },
    mouseMoveTest: function(e) {
        if (L.debug.debugWindow) {
            if (L.debug.debugWindow.$("#mousecheck").prop("checked")) {
                var x = e.latlng.lng.toFixed(6);
                var y = e.latlng.lat.toFixed(6);
                L.debug.debugWindow.$(L.debug.debugWindow.document).trigger('mapxy', x+','+y);
            }
        }
    },
    openDebug: function () {
        window.onunload = window.onbeforeunload = (function(){
            if (L.debug.debugWindow) {
                L.debug.debugWindow.close();
            }
        });
        if (this.debugWindow) {
            // Clear out any old events etc
            this.active("L.Map")["L.Map"].instances[0].off('mousemove', this.mouseMoveTest);
        }
        var html1 = html.replace('JSTEMPLATE',js);
        var html2 = html1.replace('JQTEMPLATE',jq);
        this.debugWindow = window.open("about:blank", "debug", "width=800, height=500, location=no, menubar=no, scrollbars=no, status=no, toolbar=no");
        this.debugWindow.document.open();
        this.debugWindow.document.write(html2);
        this.debugWindow.document.close();

        // Set up a test event to track the mouse
        this.active("L.Map")["L.Map"].instances[0].on('mousemove', this.mouseMoveTest);
    } 

});

// This is the generic hook into the testing system 
module.exports = function() {
    var debug = new Debug();
    debug.init();
    return debug;
};

