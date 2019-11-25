import React, { useEffect } from 'react';
import HPlatform from "react-here-map";
import RouteMarker, { icon } from './components/RouteMarker';
import HMapRoute from './components/HMapRoute';
import { data } from './data';
import { useStoreActions, useStoreState } from 'easy-peasy';
import HMap from './components/HMap';
import Polygon from "./components/Polygon";
import PolygonMarker, { circle } from "./components/PolygonMarker";
const routeLineOptions = {
  style: { strokeColor: "blue", lineWidth: 10 },
  arrows: { fillColor: "white", frequency: 2, width: 0.8, length: 0.7 }
};
const defaultStyle = {
  height: "90vh",
  width: "90vw"
};
export default function App() {
  const points = useStoreState(state => state.routes.points);
  const importData = useStoreActions(actions => actions.routes.importData);
  const setItems = useStoreActions(actions => actions.routes.setItems);
  const polygonPoints = useStoreState(state => state.routes.polygonPoints);
  const setPolygonPoint = useStoreActions(actions => actions.routes.setPolygonPoint);
  
  const getRouteParams = () => {
    let map = {};
    points.forEach(function (e) {
      var k = e['routeId'];
      map[k] = map[k] || [];
      map[k].push(e);
    });
    let newArray = Object.keys(map).map(function (k) {
      return { key: k, data: map[k] };
    });
    let groupedPoints = newArray
    let routeParamsList = groupedPoints.map(({ key, data }, index) => {
      var routeParams = {
        mode: "fastest;car",
        representation: "display"
      };
      data.forEach(({ lat, long }, index) => {
        /** waypoint2: "geo!50.5309916298853,15.3846220493377",*/
        routeParams['waypoint' + index] = `geo!${lat},${long}`;
        routeParams['data' + index] = data[index];
      })
      return routeParams
    })
    return routeParamsList
  }
  /*** component did mount */
  useEffect(() => {
    /***  used to load data to state */
    importData(data);
  }, [importData]);

  if (points.length === 0) return null;
  // const myMapevents = 
  return (
    <div>
      <HPlatform
        app_id="VbRv4nxI241gNIW5Zo2q"
        app_code="xlN6py5XZ05SMUljISjI0A"
        useCIT
        useHTTPS
        includeUI
        interactive
        includePlaces
        useEvents
      >
        <HMap
          style={defaultStyle}
          mapEvents={{
            dragstart: (ev, bh, map) => {
              var target = ev.target, pointer = ev.currentPointer;
              if (target instanceof window.H.map.Marker) {
                var targetPosition = map.geoToScreen(target.getGeometry());
                target['offset'] = new window.H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
                bh.disable();
              }
            },
            dragend: (ev, bh, map, ui) => {
              var target = ev.target;
              if (target instanceof window.H.map.Marker) {
                let { lat, lng, data, type } = { ...target.getData(), ...target.getGeometry() }
                if (type === 'circle') {
                  var { coords } = target.getData()
                  setPolygonPoint({ oldPoint: [coords.lat, coords.lng], newPoint: [lat, lng],polygonPoints, points})
                  bh.enable();
                  return null
                }
                setItems({ data, lat, lng, points, polygonPoints });
                bh.enable();
              }
            },
            drag: (ev, bh, map, ui) => {
              var target = ev.target,
                pointer = ev.currentPointer;
              if (target instanceof window.H.map.Marker) {
                target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
              }
            },
            tap: (ev, bh, map, ui) => {
              var target = ev.target;
              if (target instanceof window.H.map.Marker) {
                if (target.getData().type === 'circle') {
                  return null
                }
                let content = `
                ${JSON.stringify(target.getData())}
                `;
                // show info bubble
                ui.addBubble(new window.H.ui.InfoBubble(ev.target.getGeometry(), { content }));
              } else {
                /** close all other opened bubles */
                ui.getBubbles().map(ite => ite.close())
              }
            }
          }}
        >
          <Polygon routeShape={polygonPoints} ></Polygon>
          {
            polygonPoints.map((item, index) => {
              return (<PolygonMarker
                key={index}
                coords={{ lat: item[0], lng: item[1] }}
                icon={circle}
                setViewBounds={false}
              />)
            })}
          {
            getRouteParams().map((routeParams, index) => {
              return (
                <HMapRoute
                  key={index}
                  routeParams={routeParams}
                  icon={icon}
                  defaultDisplay
                  lineOptions={routeLineOptions}
                  renderDefaultLine={false}
                  isoLine={false}
                >
                  <RouteMarker />
                </HMapRoute>
              )
            })
          }
        </HMap>
      </HPlatform>;
    </div>
  )
}