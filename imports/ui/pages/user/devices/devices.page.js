import './devices.page.html';

Template.Devices.onCreated(function () {
    this.editingFile = new ReactiveVar();
});

Template.Devices.onRendered(function () {
    let self = this;

});


Template.Devices.events({
    'click .js-device-edit': function (e, tmpl) {
        let deviceId = $(e.currentTarget).data("device");
        tmpl.editingFile.set(deviceId);
    },
});

Template.Devices.helpers({
    'devicesList': function () {
        return Devices.find().fetch();
    },
    'editingFile': function () {
        let tmpl = Template.instance();
        return tmpl.editingFile.get();
    },
    "getViewFiles": function (device) {
        //let device = Template.instance().data.device;
        if (device && device.published_view !== undefined) {
            return device.views[device.published_view].files;
        }

        return [];
    },
});







Template.Devices_edit.onCreated(function () {
    this.templateStartup = new ReactiveVar(true); // flag certain variable startup once
    this.selectedDisplayView = new ReactiveVar(null);
    this.counter = new ReactiveVar(0);

    this.device = new ReactiveVar(null);
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
        let data = {};
        
        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if (key == "display_view") {
            //set the current display view in edit mode
            self.selectedDisplayView.set(val);
            return;
        } else if (key == "file") {
            let selectedView = self.selectedDisplayView.get();
            let fileId = target.data("file");

            if (selectedView && fileId && device.views !== undefined && device.views[selectedView] !== undefined) {
                let deviceFilesList = device.views[selectedView].files;
                if (Array.isArray(deviceFilesList)) {
                    if (!deviceFilesList.includes(fileId)) {
                        deviceFilesList.push(fileId);
                        data["views." + selectedView + ".files"] = deviceFilesList;
                    }
                } else {
                    //nothing exists -> create array
                    data["views." + selectedView + ".files"] = [fileId];
                }
            } else {
                //nothing exists -> create array
                data["views." + selectedView + ".files"] = [fileId];
            }
        } else {
            data[key] = val;
        }

        if (!$.isEmptyObject(data)) {
            Devices.update(device._id, {
                $set: data
            });
        }


    });

});

Template.Devices_edit.events({
    'click .js-remove-file': function (e, tmpl) {
        let target = $(e.currentTarget);
        let device = tmpl.device.get();
        let view = tmpl.selectedDisplayView.get();
        let fileId = target.data("file");
        let index = target.data("index");

        if (device && view) {
            let deviceFilesList = device.views[view].files;
            //remove item index
            deviceFilesList.splice(index, 1);

            Devices.update(device._id, {
                $set: { ["views." + view + ".files"]: deviceFilesList }
            });


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
    "renderEvent": function (deviceId) {
        //console.log(deviceId);
        if (!deviceId)
            return;

        let tmpl = Template.instance();
        let device = Devices.findOne(deviceId);

        tmpl.device.set(device);

        if (tmpl.templateStartup.get()) {
            //render startup event
            tmpl.selectedDisplayView.set(device.published_view);
            tmpl.templateStartup.set(false);
        }


        return;
    },
    "getViewFiles": function () {
        let tmpl = Template.instance();
        let device = tmpl.device.get();
        //let view = tmpl.selectedDisplayView.get();
        if (device && device.published_view !== undefined) {
            return device.views[device.published_view].files;
        }

        return [];

    },
    "publishedDisplayView": function () {
        let device = Template.instance().device.get();
        if (device) {
            return device.published_view;
        }

        return "";

    },
    "displayViewExists": function () {
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
