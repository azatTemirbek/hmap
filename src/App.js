import React, { useEffect } from 'react';
import HPlatform, {
  HMap
} from "react-here-map";
import RouteMarker, { icon } from './components/RouteMarker';
import HMapRoute from './components/HMapRoute';
import { data } from './data';
import { useStoreActions, useStoreState } from 'easy-peasy';

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


export default function App() {
  const points = useStoreState(state => state.routes.points);
  const importData = useStoreActions(actions => actions.routes.importData);
  /*** component did mount */
  useEffect(() => {
    importData(data);
  });
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
            renderDefaultLine={true}
            isoLine={true}
          >
            <RouteMarker />
          </HMapRoute>
        </HMap>
      </HPlatform>;

    </div>
  )
}


