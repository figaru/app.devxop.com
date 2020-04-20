UserRouter.route('/media', {
    name: "media",
    subscriptions: function(params, queryParams) {
        //this.register('allFiles', Meteor.subscribe('files.all'));
        //this.register('allFiles', Meteor.subscribe('files.all'));
    },
    action: function () {
        BlazeLayout.render('App_user', { main: 'Media' });
    }
});

UserRouter.route('/media/drive/:type', {
    name: "media.drive",
    subscriptions: function(params, queryParams){
        // using Fast Render
        //this.register('filesByType', Meteor.subscribe('files.allByType', params.type));
    },
    action: function (params, queryParams) {
        BlazeLayout.render('App_user', { main: 'Media_drive', params: params });
    }
});