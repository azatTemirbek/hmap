import React from 'react'
import Marker from './Marker'
import { icon } from './RouteMarker';
export default function RouteMarkerDetail(props) {
    window.debug && console.log('RouteMarkerDetail', props)
    let {
        mappedPosition,
        map, platform, ui, route, routeShape, ...params
    } = props
    let marker = { lat: mappedPosition.latitude, lng: mappedPosition.longitude };
    return (
        <Marker
            coords={marker}
            map={map}
            platform={platform}
            icon={icon}
            props={params}
        />
    )
}