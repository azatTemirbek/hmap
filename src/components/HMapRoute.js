import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEqual } from 'lodash';
/**
 * A component used to get routes and provide to children
 */
export default class HMapRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {route:[]}
        console.log('HMapRoute', props)
        this.update = this.update.bind(this)
    }
    async update(){
        await this.routingService.calculateRoute(
            this.props.routeParams,
            ({ response }) => {
                this.setState({route:response.route})
            }
            , e => console.log(e.message)
        );
    }
    async shouldComponentUpdate(nextProps, nextState){
         // returns false if different
        if(!isEqual(nextProps.routeParams, this.props.routeParams)){
            await this.update()
            alert()
        }
        return true
    }
    async componentWillMount() {
        this.routingService = await this.props.platform.getRoutingService();
        await this.update()
    }
    render() {
        let { children, ...params } = this.props
        let { route } = this.state

        /** will return ıs date ıs null */
        if (!children || route.length===0) return null;
        let _routeShape = route[0].shape.map(point => {
            const coords = point.split(",");
            return { lat: coords[0], lng: coords[1] };
        });
        return React.Children.map(children, child => {
            return React.cloneElement(child, { ...params, routeShape: _routeShape, route: route[0] });
        });
    }
}

HMapRoute.propTypes = {
    routeParams: PropTypes.object,
    lineOptions: PropTypes.object,
    markerOptions: PropTypes.object,
    children: PropTypes.element,
    renderDefaultLine: PropTypes.bool,
    icon: PropTypes.any,
    map: PropTypes.object,
    platform: PropTypes.object,
    ui: PropTypes.object
};
