/*
**
**  FORGET THE PLUGIN INTERFACE, THE IMPROPER BUT SUCCINCT WAY ( < 125 lines ) TO WRITE L.DEBUG
**
*/

// higher order classes for fun
window.L.Class.prototype._class_name_ = 'L.Class';
window.L.Map.prototype._class_name_ = 'L.Map';
// marker types
window.L.Marker.prototype._class_name_ = 'L.Marker';
window.L.Popup.prototype._class_name_ = 'L.Popup';
window.L.Icon.prototype._class_name_ = 'L.Icon';
// group types
window.L.LayerGroup.prototype._class_name_ = 'L.LayerGroup';
window.L.FeatureGroup.prototype._class_name_ = 'L.FeatureGroup';
window.L.GeoJSON.prototype._class_name_ = 'L.GeoJSON';
// image/tile types
window.L.TileLayer.prototype._class_name_ = 'L.TileLayer';
window.L.ImageOverlay.prototype._class_name_ = 'L.ImageOverlay';
window.L.TileLayer.WMS.prototype._class_name_ = 'L.TileLayer.WMS';
window.L.TileLayer.Canvas.prototype._class_name_ = 'L.TileLayer.Canvas';
// vector types
window.L.Path.prototype._class_name_ = 'L.Path';
window.L.Circle.prototype._class_name_ = 'L.Circle';
window.L.CircleMarker.prototype._class_name_ = 'L.CircleMarker';
window.L.Polyline.prototype._class_name_ = 'L.Polyline';
window.L.MultiPolyline.prototype._class_name_ = 'L.MultiPolyline';
window.L.Polygon.prototype._class_name_ = 'L.Polygon';
window.L.MultiPolygon.prototype._class_name_ = 'L.MultiPolygon';
window.L.Rectangle.prototype._class_name_ = 'L.Rectangle';

/*
**  alter L.Class prototype for all descendents to show inheritence string
*/
window.L.Class.prototype.toInheritString = function() {
    var self = this; // don't overwrite 'this' ref
    var class_name_lookup = []; 
    while ( typeof self.constructor.__super__ !== 'undefined' ) { 
        class_name_lookup.push( self.constructor.__super__._class_name_ );
        self = self._class_name_ === 'L.Class' ? {} : self.constructor.__super__;
    }   
    return class_name_lookup.join( ' => ' );
};

window.L.Class.prototype.getType = function() {
    if ( typeof this._class_name_ === 'undefined' ) return;
    return this._class_name_;
};

/*
**  alter L.Map prototype for layer debugging
*/ 
window.L.Map.prototype._dump2Console = function( hash_array ) {
    hash_array.forEach( function( hash ) {
        console.log( "[ LAYER ", hash.layerID, " ]: ", hash.type );
    });
};
window.L.Map.prototype._filterLayerTypes = function( tarray ) {
    var self = this; // don't overwrite 'this' ref
    var filtered = [];
    Object.keys( this._layers )
        .forEach( function( key ) {
            var types = tarray.filter( function( class_type ) { 
                return self._layers[ key ] instanceof class_type;
            });
            if ( types.length > 0 )
                filtered.push( { 'layerID' : key, 'type' : self._layers[ key ].toInheritString() } );
        });
    return filtered;
};
window.L.Map.prototype._listLayerTypes = function( tarray ) {
    // TODO: recursive call on GeoJSON, FeatureGroup, LayerGroup
    var f = this._filterLayerTypes( tarray );
    this._dump2Console( f );
    return f;
};
window.L.Map.prototype.listVectorLayers = function( ) {
    return this._listLayerTypes ([
        L.Path,
        L.Circle,
        L.CircleMarker,
        L.Rectangle,
        L.Polyline,
        L.MultiPolyline,
        L.Polygon,
        L.MultiPolygon,
        L.Marker,
        L.Popup,
        L.GeoJSON,
        L.FeatureGroup,
        L.LayerGroup
    ]);
};
window.L.Map.prototype.listTileLayers = function( ) {
    return this._listLayerTypes ([
        L.TileLayer,
        L.ImageOverlay,
        L.TileLayer.WMS,
        L.TileLayer.Canvas
    ]);
};
window.L.Map.prototype.listGroupLayers = function( ) {
    return this._listLayerTypes ([
        L.LayerGroup,
        L.FeatureGroup,
        L.GeoJSON
    ]);
};
window.L.Map.prototype.listMarkerLayers = function( ) {
    return this._listLayerTypes ([
        L.Marker,
        L.CircleMarker,
        L.Popup
    ]);
};
window.L.Map.prototype.getLayerByRef = function( layer_ref ) {
    return this._layers[ L.stamp( layer_ref ) ];
};
window.L.Map.prototype.getLayerByID = function( id ) {
    if( ""+id in this._layers ) return this._layers[ ""+id ];
};


