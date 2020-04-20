Template.registerHelper('getRoute', () => {
    let data = {};

    //Listen for path change
    FlowRouter.watchPathChange();

    //get current route
    let router = FlowRouter.current();

    //used to ignore level one of route for a previous link
    let level = router.path.match(new RegExp(/\//g));

    data["current"] = {
        "name": router.route.name,
        "path": router.route.path
    };

    if (router["oldRoute"] && level.length > 1) {
        //we show the user a back link for previous page
        data["previous"] = {
            "name": router.oldRoute.name,
            "path": router.oldRoute.path
        };
    }

    return data;

});
