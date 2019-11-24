import React from 'react'
import PropTypes from 'prop-types'
import merge from "lodash.merge";



export default function Marker({
    coords,
    icon,
    options,
    type,
    setViewBounds,
    map
}) {
    if (!H || !H.map || !map) throw new Error("HMap has to be initialized before adding Map Objects");
    if (!coords.lat || !coords.lng) throw new Error("coords should be an object having 'lat' and 'lng' as props");
    if (!icon) throw new Error("icon is not set, Marker will not be rendered");
    
    var _options = options;

    if (type && type === "DOM") {
        _options.icon = new H.map.DomIcon(icon, iconOptions );
    } else if (type) {
        // Displays a static icon
        _options.icon = new H.map.Icon(icon,iconOptions);
    } // Create an icon, an object holding the latitude and longitude, and a marker:
    var _marker = updateMarker && marker ? marker : new H.map.Marker(coords, _options); // Checks if object of same coordinates have been added formerly

    var addedObjects = map.getObjects();
    var objectExists = addedObjects.some(function (object) {
        if (typeof object.getPosition === "function") {
            var _object$getPosition = object.getPosition(),
                lat = _object$getPosition.lat,
                lng = _object$getPosition.lng;
            return lat === coords.lat && coords.lng === lng;
        }
    }); // This object exists we don't want to add it again. Update the position

    if (!objectExists && !updateMarker) {
        map.addObject(_marker);
    } else if (updateMarker) {
        // If we are updating, no need to create
        _marker.setPosition(coords);
    } // Send the marker to the parent


    setViewBounds ? map.setCenter(coords) : null; // There is no need to render something useful here, HereMap does that magically
    return (
        <div style={{ display: none }} />
    )
}

function Marker(props) {
    var _merge = merge({
        setViewBounds: true,
        updateMarker: false,
        marker: null,
        getMarker: function getMarker() { }
    }, props),

        icon = _merge.icon,
        map = _merge.map,
        coords = _merge.coords,
        type = _merge.type,
        options = _merge.options,
        setViewBounds = _merge.setViewBounds,
        updateMarker = _merge.updateMarker,
        marker = _merge.marker,
        getMarker = _merge.getMarker,
        platform = _merge.platform,
        ui = _merge.ui,
        __options = _merge.__options;




    


    !marker ? getMarker(_marker) : null; // Centers the marker


    return React.createElement("div", {
        style: {
            display: "none"
        }
    });
}

Marker.propTypes = {
    coords: PropTypes.object.isRequired,
    icon: PropTypes.any,
    iconOptions: PropTypes.object,
    options: PropTypes.object,
    type: PropTypes.string,
    setViewBounds: PropTypes.bool,
    map: PropTypes.object,
};
Marker.defaultProps = {
    iconOptions:{
        onAttach: function (clonedElement, domIcon, domMarker) { },
        onDetach: function (clonedElement, domIcon, domMarker) { },
    }
}
export default Marker;