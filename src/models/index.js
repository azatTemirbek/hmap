import { action } from "easy-peasy";

const routeModel = {
    points: [],
    importData: action((state,payload) => {
        state.points = payload;
    })
};

const storeModel = {
    routes: routeModel,
};

export default storeModel;