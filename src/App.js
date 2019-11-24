import React, { useEffect } from 'react';
import HPlatform from "react-here-map";
import RouteMarker, { icon } from './components/RouteMarker';
import HMapRoute from './components/HMapRoute';
import { data } from './data';
import { useStoreActions, useStoreState } from 'easy-peasy';
import HMap from './components/HMap';
import Polygon from "./components/Polygon";
import hull from "hull.js";



/***
 * marker hover ounca popup gosterme 67 satirda
 * drag drop marker 36 satira action yazilmasi gerekiyor ve test
 * 
 * Polygon :
 * computed olarak noktaları çıkarmak  importData listener eklenmesi easy peasy
 * sonra da resıze ozellıgı eklemek
 */

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
        // The routing mode:
        mode: "fastest;car",
        // representation mode 'display'
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
  const getRouteParams4Polygon = () => {
    var routeParams = {
      // The routing mode:
      mode: "fastest;car",
      // representation mode 'display'
      representation: "display"
    };
    points.map((data, index) => {
      /** waypoint2: "geo!50.5309916298853,15.3846220493377",*/
      routeParams['waypoint' + index] = `geo!${data.lat},${data.long}`;
      routeParams['data' + index] = data;
    })
    debugger
    return routeParams
  }
  const getPoints4Polygon = () => {
    let points4P = [];
    points.map((data, index) => {
      points4P.push([data.lat,data.long])
    })
    console.log(hull(points4P))
    debugger
    return hull(points4P);
  }
  /*** component did mount */
  useEffect(() => {
    /***  used to load data to state */
    importData(data);
  }, [importData]);

  if (points.length === 0) return null;
  const myMapevents = {
    dragstart: (ev, bh, map) => {
      // debugger
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
        let { originalPosition, lat, lng, data, ...params } = { ...target.getData(), ...target.getGeometry() }
        let index = -1;
        points.map((itm, i) => {
          if (itm.long == data.long && itm.lat == data.lat) {
            index = i;
          }
          return itm
        })
        // map.getObjects().map(item=>{
        //   if (item instanceof window.H.map.Polyline ){
        //     // map.removeObject(item)
        //   }
        // })
        index !== -1 && setItems({ index, lat, lng });
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
        console.log(target.getData())
        let { originalPosition } = target.getData();
        // todo: html string
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
  }
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
          mapEvents={myMapevents}
        >
          {/* <HMapRoute
            key={'index'}
            // iso
            routeParams={getRouteParams4Polygon()}
            icon={icon}
            defaultDisplay
            lineOptions={routeLineOptions}
            renderDefaultLine={false}
            isoLine={false}
          > */}
            <Polygon routeShape={getPoints4Polygon()} ></Polygon>
          {/* </HMapRoute> */}
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


