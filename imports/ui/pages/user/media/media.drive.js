import './media.drive.html';

Template.Media_drive.onCreated(function(){
    //let type = doc.file.mimetype.substring(0, 3);
    //let params = FlowRouter.current().params

    this.editingFile = new ReactiveVar();
});


Template.Media_drive.onRendered(function () {
    // set up local reactive variables
    let self = this;
    let data = self.data;

    $(document).on('fileEdit', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let file = Files.findOne(self.editingFile.get())
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        //console.log(file);
        /* console.log(key + ":" + val); */
        let data = {};
        data[key] = val;

        Files.update(file._id, {
            $set: data
        });
    });
});

Template.Media_drive.events({
    'click [pd-popup-open]': function(e, tmpl){
        let fileId = $(e.currentTarget).data("file");
        tmpl.editingFile.set(fileId);
    },
    'click .js-delete': function (event, tmpl) {
        event.preventDefault();
        let id = event.target.id;
        Meteor.call("files.remove", id, function(err, result){
            if(err){
                console.log(err);
            }else{
                console.log(result);
                tmpl.$(".popup-close").click();
            }
        });
    },
});

Template.Media_drive.helpers({
    'listFiles': function(){
        let params = FlowRouter.current().params;
        let type = params.type.substring(0, 3);

        if(params.type == "other"){
            return Files.find({ "is_video": false, "is_image": false });
        }else{
            return Files.find({"file.mimetype": { $regex: ".*"+ type +".*" }})
        }

        
    },
    'editingFile': function(){
        let tmpl = Template.instance();
        return Files.findOne(tmpl.editingFile.get());
    }
});