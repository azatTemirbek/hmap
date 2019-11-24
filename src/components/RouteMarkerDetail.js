import React,{useEffect,useState} from 'react'
import {
    HMapMarker,
} from "react-here-map";
import { icon } from './RouteMarker';

export default function RouteMarkerDetail({
    mappedPosition,
    map, platform, ui, route, routeShape,...props 
}) {
    console.log('RouteMarkerDetail',props)
    const [updateMarker,setUpdateMarker] = useState(false)
    let Marker = { lat: mappedPosition.latitude, lng: mappedPosition.longitude };
    useEffect(() => {
        // Update the document title using the browser API
        setUpdateMarker(true)
      });
    return (
        <HMapMarker
            coords={Marker}
            map={map}
            platform={platform}
            icon={icon}
            setViewBounds
            // type='DOM'
            updateMarker={updateMarker}
            getMarker={(marker) => {
                /** set options of the marker */
                marker.draggable = true
                marker.setData(props)
                return marker
            }}
        />
    )
}
