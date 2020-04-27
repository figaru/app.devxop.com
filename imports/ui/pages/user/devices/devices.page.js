import './devices.page.html';

Template.Devices.onCreated(function () {
    this.editingFile = new ReactiveVar();
});

Template.Devices.onRendered(function () {
    let self = this;

});


Template.Devices.events({
    'click [pd-popup-open]': function (e, tmpl) {
        let deviceId = $(e.target).data("device");
        //console.log(deviceId);
        if (deviceId) {
            tmpl.editingFile.set(deviceId);
        }

    },
});

Template.Devices.helpers({
    'devicesList': function () {
        return Devices.find().fetch();
    },
    'editingFile': function () {
        let tmpl = Template.instance();
        return Devices.findOne(tmpl.editingFile.get());
    },
    "getViewFiles": function(device){
        //let device = Template.instance().data.device;
        if(device){
            return device.views[device.published_view].files;
        }

        return [];
    },
});







Template.Devices_edit.onCreated(function () {
    this.selectedDisplayView = new ReactiveVar();
    this.counter = new ReactiveVar(0);

    this.device = new ReactiveVar();
});

Template.Devices_edit.onRendered(function () {
    // set up local reactive variables
    let self = this;

    $(document).on('deviceEdit', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let device = self.device.get();
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        let data = {};


        if (key == "display_view") {
            //set the current display view in edit mode
            self.selectedDisplayView.set(val);
            return;
        } else if (key == "file") {
            //retrieve the file id
            //console.log(target.data("file"));
            let selectedView = self.selectedDisplayView.get();
            let fileId = target.data("file");

            if (selectedView && fileId) {

                Devices.update(device._id,
                    {
                        $addToSet: { ["views." + selectedView + ".files"]: fileId }
                    }
                );

                /* console.log(device);
                let deviceFilesList = device.views[selectedView].files;

                if (Array.isArray(deviceFilesList)) {

                    if (!deviceFilesList.includes(fileId)) {
                        deviceFilesList.push(fileId);

                        data["views." + selectedView + ".files"] = deviceFilesList;
                    }else{
                        console.log("List already includes this file.");
                        //end this update
                        return;
                    }

                } else {
                    //nothing exists -> create array
                    //data["views." + selectedView + ".files"] = [fileId];
                    Devices.update(device._id, 
                        {
                            $set: { ["views." + selectedView + ".files"] : [fileId] }
                        }
                    );
                } */


            }

            //console.log(data);
            //return;
        } else {
            data[key] = val;
        }


        Devices.update(device._id, {
            $set: data
        });

    });

});

Template.Devices_edit.events({
    'click .js-remove-file': function (e, tmpl) {
        let target = $(e.currentTarget);
        let device = tmpl.device.get();
        let view = tmpl.selectedDisplayView.get();
        let fileId = target.data("file");

        if (device && view) {
            Devices.update(device._id,
                { $pull: { ["views." + view + ".files"]: fileId } },
                { multi: true }
            );
        }

    },
    'click .js-publish-displayView': function (e, tmpl) {
        let device = tmpl.device.get();
        let view = tmpl.selectedDisplayView.get();
        if (view && device) {
            Devices.update(device._id, {
                $set: {
                    "published_view": view
                }
            });
        }

    }
});

Template.Devices_edit.helpers({
    "deviceDoc": function () {
        return Template.instance().device.get();
    },
    "renderEvent": function (doc) {
        if (!doc)
            return;

        let tmpl = Template.instance();
        tmpl.device.set(doc);
        tmpl.selectedDisplayView.set(doc.published_view);


        return;
    },
    "getViewFiles": function(){
        let device = Template.instance().device.get();
        if(device){
            return device.views[device.published_view].files;
        }

        return [];
        
    },
    "publishedDisplayView": function(){
        let device = Template.instance().device.get();
        if(device){
            return device.published_view;
        }

        return "";
        
    },
    "displayViewExists": function(){
        return Template.instance().selectedDisplayView.get();
    },
    "displayViewEdit": function (viewType) {
        let selectedView = Template.instance().selectedDisplayView.get();
        return typeof selectedView != "undefined" && selectedView === viewType ? true : false;
    },
    "displayViewPublished": function (viewType) {
        let selectedView = Template.instance().selectedDisplayView.get();
        let device = Template.instance().device.get();
        return typeof selectedView != "undefined" && selectedView === device.published_view ? true : false;
    },
    "dropdownViewList": function () {
        return [
            {
                "key": "display_view",
                "value": "video",
                "label": "Video"
            },
            {
                "key": "display_view",
                "value": "image",
                "label": "Image"
            }
        ];
    }
})
