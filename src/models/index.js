import { action, computed, actionOn } from "easy-peasy";
import hull from "hull.js";

const routeModel = {
    points: [],
    polygonPoints: [],
    /** will get groued array of objects */
    groupBy: computed(state => fieldName => {
        let map = {};
        state.points.forEach(function (e) {
            var k = e[fieldName];
            map[k] = map[k] || [];
            map[k].push(e);
        });
        let newArray = Object.keys(map).map(function (k) {
            return { key: k, data: map[k] };
        });
        return newArray
    }),
    /** will transform route params option from points state */
    getRouteParams: computed([state => state.points], points => {
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
    }),
    /** function to import data from payload */
    importData: action((state, payload) => {
        state.points = payload;
        let points4P = [];
        payload.forEach((data, index) => {
            points4P.push([data.lat, data.long])
        })
        state.polygonPoints = hull(points4P);
    }),
    setItems: action((state, { data, lat, lng, points }) => {
        state.points = points.map((it)=>{
            if(it.routeId===data.routeId && it.sequence === data.sequence){
                it.lat = lat;
                it.long = lng;
            }
            return it
        })
    }),
    setPolygonPoint: action((state, {oldPoint, newPoint, polygonPoints}) => {
        let pp = state.polygonPoints;
        for (var i = 0; i < pp.length; i++) {
            if (pp[i][0] === oldPoint[0] && pp[i][1] === oldPoint[1]) {
                pp[i][0] = newPoint[0];
                pp[i][1] = newPoint[1];
            }
        }
        state.polygonPoints = pp;
    }),
    /** listener to rebuild points */
    onSetItems: actionOn(
        actions => actions.setItems,
        // handler:
        (state, target) => {
            let points = state.points;
            let points4P = []
            points.forEach((data) => {
                points4P.push([data.lat,data.long])
            })
            // points4P = hull(points4P)
            var payload = [...state.polygonPoints, ...points4P];
            state.polygonPoints = hull(payload);
        }
    ),
    onSetPolygonPoint: actionOn(
        actions => actions.setPolygonPoint,
        // handler:
        (state, target) => {
            let points = state.points;
            let points4P = []
            points.forEach((data) => {
                points4P.push([data.lat,data.long])
            })
            // points4P = hull(points4P)
            // debugger
            var payload = [...state.polygonPoints, ...points4P];
            state.polygonPoints = hull(payload);
        }
    )
};
const storeModel = {
    routes: routeModel,
};
export default storeModel;