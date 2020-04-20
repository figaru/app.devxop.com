// handling public route
UserRouter.route('/dashboard', {
    name: "dashboard",
    action: function () {
        BlazeLayout.render('App_user', { main: 'Dashboard' });
    }
});