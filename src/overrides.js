
/*
**
**  alter prototype for all children
**
*/
window.L.Class.prototype.toInheritString = function() { // L.Class.prototype.toString

    var self = this; // don't overwrite this ref
    var class_name_lookup = []; 
    while ( typeof self._class_name_ !== 'undefined' ) { 
        class_name_lookup.unshift( self._class_name_ || "" );
        self = self._class_name_ === 'L.Class' ? {} : self.constructor.__super__;
    }   
    return class_name_lookup.join( ' => ' );
};

window.L.Class.prototype._class_name_ = 'L.Class';
window.L.Path.prototype._class_name_ = 'L.Path';
window.L.Polyline.prototype._class_name_ = 'L.Polyline';
window.L.Polygon.prototype._class_name_ = 'L.Polygon';

