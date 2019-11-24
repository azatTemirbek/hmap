import { action, computed } from "easy-peasy";

const routeModel = {
    points: [],
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
    getRouteParams: computed([state=>state.points],points => {
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
    }),
    setItems: action((state, {index, lat,lng}) => {
        state.points[index].lat = lat;
        state.points[index].long = lng;
    })
};

const storeModel = {
    routes: routeModel,
};

export default storeModel;