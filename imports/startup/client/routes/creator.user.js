UserRouter.route('/creator', {
    name: "creator",
    subscriptions: function(){
        
    },
    action: function () {
        BlazeLayout.render('App_user', { main: 'Creator' });
    }
});