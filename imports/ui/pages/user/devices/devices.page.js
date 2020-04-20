import './devices.page.html';

Template.Devices_edit.onCreated(function(){
    this.selectedDisplayView = new ReactiveVar();
    this.counter = new ReactiveVar(0);
});

Template.Devices_edit.onRendered(function () {
    // set up local reactive variables
    let self = this;
    let data = self.data;
    
    if (data && data.isPopup) {

    }

    $(document).on('deviceEdit', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if(key == "display_view"){
            //set the current display view in edit mode
            self.selectedDisplayView.set(val);
        }else if(key == "file"){
            //retrieve the file id
            
        }

        console.log(key + ":" + val);
    });
});


Template.Devices_edit.helpers({
    "canSelectFile": function (viewType) {
        let selectedView = Template.instance().selectedDisplayView.get();
        return typeof selectedView != "undefined" && selectedView === viewType ? true : false ;
    },
    "test": function () {
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
