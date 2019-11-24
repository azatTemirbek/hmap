// Add interactivity if set from the options
// interactive and useEvents must be true to use map events
export default (map, interactive, useEvents, mapEvents, ...params) => {
    let behavior = interactive
        ? new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
        : null;
    if (useEvents && interactive) {
        for (const type in mapEvents) {
            if (mapEvents.hasOwnProperty(type)) {
                const callback = mapEvents[type];
                map.addEventListener(type, evt => {
                    callback(evt, behavior,map, ...params);
                });
            }
        }
    }
    return behavior;
};