import React from 'react'
import {
    HMapMarker,
    HMapPolyLine
} from "react-here-map";



export const icon =
  '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
  'height="22" /><text x="12" y="18" font-size="12pt" ' +
  'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
  'fill="white">H</text></svg>';

// Handles manipulation of the path between the two points
export default function RouteMarker({ map, platform, ui, route, key, routeShape }) {
    alert()
    // Retrieve the mapped positions of the requested waypoints:
    const startPoint = route.waypoint[0].mappedPosition;
    const endPoint = route.waypoint[1].mappedPosition;

    // Create a marker for the start point:
    const startMarker = { lat: startPoint.latitude, lng: startPoint.longitude };
    // Create a marker for the end point:
    const endMarker = { lat: endPoint.latitude, lng: endPoint.longitude };

    return (
        <React.Fragment>
            <HMapPolyLine points={routeShape} map={map} setViewBounds />
            <HMapMarker
                coords={startMarker}
                map={map}
                platform={platform}
                icon={icon}
                setViewBounds
            />
            <HMapMarker
                coords={endMarker}
                map={map}
                platform={platform}
                icon={icon}
                setViewBounds
            />
        </React.Fragment>
    );
};
