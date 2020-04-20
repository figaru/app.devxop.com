// handling public route
UserRouter.route('/devices', {
    name: "devices",
    action: function () {
        BlazeLayout.render('App_user', { main: 'Devices' });
    }
});