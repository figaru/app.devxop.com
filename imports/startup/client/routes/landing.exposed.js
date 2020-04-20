/* import route group exposed */

// handling public route
ExposedRouter.route('/', {
    action: function() {
        console.log("Rendering landing...");
      BlazeLayout.render('App_exposed', {main: 'Landing_overview'});
    }
  });