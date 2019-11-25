import PropTypes from "prop-types";
import merge from "lodash.merge";
import { isEqual } from 'lodash';


import React, { Component } from 'react'

export default class PolyLine extends Component {
    async shouldComponentUpdate(nextProps, nextState) {
        // returns false if different
        if (!isEqual(nextProps.points, this.props.points)) {
            nextProps.map.removeObject(this.polyLine);
            var lineString = new window.H.geo.LineString();
            nextProps.points.forEach(function (point) {
                lineString.pushPoint(point);
            });
            // Initialize a polyLine with the lineString:
            this.polyLine = new window.H.map.Polyline(lineString, nextProps.options);
            nextProps.map.addObject(this.polyLine);
            return true
        }
        return true
    }
    componentDidMount() {
        const {
            points,
            options,
            map,
            setViewBounds,
        } = merge({ setViewBounds: true }, this.props);
        if (!window.H || !window.H.map || !map) {
            throw new Error("HMap has to be initialized before adding Map Objects");
        }

        if (!Array.isArray(points)) {
            throw new Error(
                "points should be an array of objects containing lat and lng properties"
            );
        }
        // Initialize a LineString and add all the points to it:
        var lineString = new window.H.geo.LineString();
        points.forEach(function (point) {
            lineString.pushPoint(point);
        });

        // Initialize a polyLine with the lineString:
        this.polyLine = new window.H.map.Polyline(lineString, options);

        // Add the polyLine to the map:
        map.addObject(this.polyLine);

        if (setViewBounds) {
            // Zoom the map to make sure the whole polyLine is visible:
            map.setViewBounds(this.polyLine.getBounds());
        }

    }
    render() {
        return (<div style={{ display: "none" }} />)
    }
}

PolyLine.propTypes = {
    points: PropTypes.array.isRequired,
    options: PropTypes.object,
    map: PropTypes.object,
    setViewBounds: PropTypes.bool
};
