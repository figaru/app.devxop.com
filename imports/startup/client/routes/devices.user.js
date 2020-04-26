// handling public route
UserRouter.route('/devices', {
    name: "devices",
    subscriptions: function(){
        this.register('allDevices', Meteor.subscribe('devices.all'));
    },
    action: function () {
        BlazeLayout.render('App_user', { main: 'Devices' });
    }
});