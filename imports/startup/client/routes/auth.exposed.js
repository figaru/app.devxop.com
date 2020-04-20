

// handling public route
ExposedRouter.route('/login', {
    action: function () {
        BlazeLayout.render('App_exposed', { main: 'Login' });
    }
});