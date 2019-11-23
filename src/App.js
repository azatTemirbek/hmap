import React from 'react';
import HPlatform, {
  HMap,
  HMapRoute,
  HMapMarker,
  HMapPolyLine
} from "react-here-map";
/***
 * todo :: make state and load from datajs 
 * state gore rota olushturama
 * noktalara marker gosterme
 * drag drop marker
 * 
 * Polygon :
 * computed olarak noktaları çıkarmak 
 * sonra da resıze ozellıgı eklemek
 */
// Create the parameters for the routing request:
var routeParams = {
  // The routing mode:
  mode: "fastest;car",
  // The start point of the route:
  waypoint0: "geo!50.1120423728813,8.68340740740811",
  // The end point of the route:
  waypoint1: "geo!52.5309916298853,13.3846220493377",
  // To retrieve the shape of the route we choose the route
  // representation mode 'display'
  representation: "display"
};
const routeLineOptions = {
  style: { strokeColor: "blue", lineWidth: 10 },
  arrows: { fillColor: "white", frequency: 2, width: 0.8, length: 0.7 }
};

const icon =
  '<svg width="24" height="24" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
  'height="22" /><text x="12" y="18" font-size="12pt" ' +
  'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
  'fill="white">H</text></svg>';

// Handles manipulation of the path between the two points
const RouteMarker = ({ map, platform, ui, route, key, routeShape }) => {
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

export default function App() {
  return (
    <div>
      <HPlatform
        app_id="VbRv4nxI241gNIW5Zo2q"
        app_code="xlN6py5XZ05SMUljISjI0A"
        useCIT
        useHTTPS
        includeUI
        includePlaces
      >
        <HMap
          style={{
            height: "400px",
            width: "800px"
          }}
          mapOptions={{ center: { lat: 52.5321472, lng: 13.3935785 } }}
        >
          <HMapRoute
            routeParams={routeParams}
            icon={icon}
            defaultDisplay
            lineOptions={routeLineOptions}
          >
            <RouteMarker />
          </HMapRoute>
        </HMap>
      </HPlatform>;

    </div>
  )
}


