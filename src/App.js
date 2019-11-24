import React, { useEffect } from 'react';
import HPlatform from "react-here-map";
import RouteMarker, { icon } from './components/RouteMarker';
import HMapRoute from './components/HMapRoute';
import { data } from './data';
import { useStoreActions, useStoreState } from 'easy-peasy';
import HMap from './components/HMap';

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
  const getRouteParams = useStoreState(state => state.routes.getRouteParams);
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
        let {originalPosition, lat,lng, ...params} = {...target.getData(),...target.getGeometry()}
        let index=-1;
        points.map((itm,i)=>{
          if(itm.long === originalPosition.longitude && itm.lat === originalPosition.latitude){
            index=i;
          }
          return itm
        })
        index !== -1 && setItems({index, lat,lng} ); bh.enable();
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
        let {originalPosition} = target.getData();
        // todo: html string
        let content =`
        ${JSON.stringify(target.getData())}
        `; 
        // show info bubble
        ui.addBubble(new window.H.ui.InfoBubble(ev.target.getGeometry(), {content}));
      }else{
        /** close all other opened bubles */
        ui.getBubbles().map(ite=>ite.close())
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
          mapOptions={{ center: { lat: 38.10249165, lng: 27.16160207 }, zoom: 15 }}
          mapEvents={myMapevents}
        >
          {
            getRouteParams.map((routeParams, index) => {
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


