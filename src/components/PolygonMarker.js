import PropTypes from "prop-types";
import React, { Component } from 'react'
import merge from "lodash.merge";
import { isEqual } from 'lodash';

export const circle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" fill="transparent" stroke="red" stroke-width="4"/>
    </svg>`;
    
export default class PolygonMarker extends Component {
    constructor(props) {
        super(props)
        const {
            icon,
            map,
            coords,
            type,
            options,
            setViewBounds,
            getMarker,
        } = merge(
            { setViewBounds: false, getMarker: () => { }, type: true, options: {} },
            props
        );
        window.debug && console.log('PolygonMarker', props)
        let _options = options;
        if (!window.H || !window.H.map || !map) throw new Error("HMap has to be initialized before adding Map Objects");
        if (!coords.lat || !coords.lng) throw new Error("coords should be an object having 'lat' and 'lng' as props");
        if (!icon) { throw new Error("icon is not set, Marker will not be rendered"); }
        if (type && type === "DOM") {
            // Displays a DOM Icon
            _options.icon = new window.H.map.DomIcon(icon);
        } else if (type) {
            // Displays a static icon
            _options.icon = new window.H.map.Icon(icon);
        }
        // Create an icon, an object holding the latitude and longitude, and a marker
        this.marker = new window.H.map.Marker(coords, _options);
        let getmrkerresult = getMarker(this.marker)
        this.marker = (getmrkerresult) ? getmrkerresult : this.marker
        this.props.map.addObject(this.marker);
        // Centers the marker
        if (setViewBounds) map.setCenter(this.props.coords)
        this.marker.draggable = true;
        this.marker.setData({
            type: 'circle',
            coords: coords,
            old: undefined
        });
    }
    async shouldComponentUpdate(nextProps, nextState) {
        // returns false if different
        // debugger
        if (!isEqual(nextProps.coords, this.props.coords)) {
            
            this.marker.setData({
                type: 'circle',
                oldcords: this.props.coords,
                coords: nextProps.coords
            });
            this.marker.setPosition(nextProps.coords);
            return true
        }
        return true
    }
    render() {
        // There is no need to render something useful here, HereMap does that magically
        return <div style={{ display: "none" }} />;
    }
}

PolygonMarker.propTypes = {
    coords: PropTypes.object.isRequired,
    icon: PropTypes.any,
    options: PropTypes.object,
    type: PropTypes.string,
    setViewBounds: PropTypes.bool,
    map: PropTypes.object
};

// export default Marker;