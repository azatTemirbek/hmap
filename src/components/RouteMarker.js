import React from 'react'
import
PolyLine
    from "./PolyLine";
import RouteMarkerDetail from './RouteMarkerDetail'

export const icon =
    '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">H</text></svg>';

// Handles manipulation of the path between the two points
export default function RouteMarker({ map, platform, ui, route, routeShape }) {
    return (
        <React.Fragment>


            <PolyLine points={[...routeShape]} map={map} />
            {
                /** Retrieve the mapped positions of the requested waypoints:  */
                route.waypoint.map((o, index) => (<RouteMarkerDetail
                    key={index}
                    {...o}
                    map={map}
                    platform={platform}
                    ui={ui}
                    route={route}
                    routeShape={routeShape}
                />))
            }
        </React.Fragment>
    );
};
