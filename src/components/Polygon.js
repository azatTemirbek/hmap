import PropTypes from "prop-types";
import merge from "lodash.merge";

import React, { Component } from 'react'

export default class Polygon extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        // debugger
        const {
            routeShape,
            map,
            setViewBounds,
            options,
            platform,
            ui,
            __options
        } = merge({ setViewBounds: true }, props);
        if (!window.H || !window.H.map || !map) throw new Error("HMap has to be initialized before adding Map Objects");
        if (!Array.isArray(routeShape)) throw new Error("points should be an array of number to use in drawing the points");

        let lineString = {};
        lineString = new window.H.geo.LineString();
        routeShape.forEach((coords) => {
            
            lineString.pushLatLngAlt.apply(lineString, [coords[0], coords[1]]);
        });
        // Initialize a LineString and add all the points to it:
        this.polygon = new window.H.map.Polygon(lineString, options);

        // Add the polyLine to the map:
        map.addObject(this.polygon);

        if (setViewBounds) {
            // Zoom the map to make sure the whole polygon is visible:
            map.setViewBounds(this.polygon.getBounds());
        }

    }
    render() {
        return (<div style={{ display: "none" }} />)
    }
}


Polygon.propTypes = {
    routeShape: PropTypes.array.isRequired,
    options: PropTypes.object,
    map: PropTypes.object,
    setViewBounds: PropTypes.bool
};
