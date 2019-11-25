import React, { Component } from 'react'
import PropTypes from "prop-types";
import {isEqual} from "lodash";

export default class Marker extends Component {
    constructor(props) {
        super(props)
        window.debug && console.log('Marker', props)
        const {
            icon,
            map,
            coords,
            type,
            options,
            marker,
        } = props

        let _options = options;
        if (!window.H || !window.H.map || !map)throw new Error("HMap has to be initialized before adding Map Objects");
        if (!coords.lat || !coords.lng)throw new Error("coords should be an object having 'lat' and 'lng' as props");
        if (type && type === "DOM") {
            // Displays a DOM Icon
            _options.icon = new window.H.map.DomIcon(icon);
        } else if (type) {
            // Displays a static icon
            _options.icon = new window.H.map.Icon(icon);
        }
        this._marker = !!marker ? marker : new window.H.map.Marker(coords, _options);
        map.addObject(this._marker);
        this._marker.draggable = true;
        this._marker.setData(this.props.props);

    }
    async shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(nextProps.coords, this.props.coords)) {
            this._marker.setData(nextProps.props);
            this._marker.setPosition(nextProps.coords);
        }
        return true
    }
    render() {
        return <div style={{ display: "none" }} />;
    }
}


Marker.propTypes = {
    coords: PropTypes.object.isRequired,
    icon: PropTypes.any,
    options: PropTypes.object,
    type: PropTypes.string,
    setViewBounds: PropTypes.bool,
    map: PropTypes.object
};
