ExposedRouter = FlowRouter.group({
    triggersEnter: [function (context, redirect) {
        console.log('exposed group trigger');
    }]
});

UserRouter = FlowRouter.group({
    subscriptions: function(params, queryParams) {
        this.register('allFiles', Meteor.subscribe('files.all'));
    }
});

FlowRouter.triggers.enter([function(context){
    // context is the output of `FlowRouter.current()`

    //force update to all route helpers
    Session.set("route-event", new Date().getTime());

    //Validate user
    /* if (!Meteor.userId()) {
        FlowRouter.go("/");
    } */
}], {except: ["/", "/login"]});

ExposedRouter.notFound = {
    action() {
        BlazeLayout.render('App_exposed', { main: 'App_notFound' });
    },
};

UserRouter.notFound = {
    action() {
        BlazeLayout.render('App_exposed', { main: 'App_notFound' });
    },
};