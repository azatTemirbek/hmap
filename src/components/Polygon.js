import PropTypes from "prop-types";
import merge from "lodash.merge";
import { isEqual } from 'lodash';
import React, { Component } from 'react'
/**
 * todo: add markers to poınts
 */

export default class Polygon extends Component {
    constructor(props) {
        super(props)
        const {
            routeShape,
            map,
            setViewBounds,
            options,
        } = merge({ setViewBounds: true }, props);
        if (!window.H || !window.H.map || !map) throw new Error("HMap has to be initialized before adding Map Objects");
        if (!Array.isArray(routeShape)) throw new Error("points should be an array of number to use in drawing the points");

        let lineString = new window.H.geo.LineString();
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
    async shouldComponentUpdate(nextProps, nextState){
        // returns false if different
       if(!isEqual(nextProps.routeShape, this.props.routeShape)){
        nextProps.map.removeObject(this.polygon);
        let lineString = new window.H.geo.LineString();
        nextProps.routeShape.forEach((coords) => {
            lineString.pushLatLngAlt.apply(lineString, [coords[0], coords[1]]);
        });
        this.polygon = new window.H.map.Polygon(lineString, nextProps.options);
        // Add the polygon to the map:
        nextProps.map.addObject(this.polygon);
        return true
       }
       return true
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
