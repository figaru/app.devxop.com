import './media.drive.html';

Template.Media_drive.onCreated(function () {
    //let type = doc.file.mimetype.substring(0, 3);
    let params = FlowRouter.current().params;

    Session.set(MEDIA_DRIVE_TYPE, params.type);
    //Session.set(COLLECTION_CREATE_FILES, []);
});


Template.Media_drive.onRendered(function () {
    // set up local reactive variables
    let self = this;
    let data = self.data;

    Session.set(COLLECTION_CREATE_FILES, []);

    this.autorun(function () {
        //listen to editing file id change -> find file and update session
        let fileId = Session.get(MEDIA_EDITING_FILE_ID);
        Session.set(MEDIA_EDITING_FILE, Files.findOne(fileId));


        Session.set(VIDEO_MERGER_DATA, {});
    });

    $(document).on('fileEditEvent', function (e, elem) {
        let file = Session.get(MEDIA_EDITING_FILE);
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();
        let data = {};

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        data[key] = val;

        Files.update(file._id, {
            $set: data
        });

    });

    $(document).on('videoMergerEvent', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let file = Session.get(MEDIA_EDITING_FILE);
        let target = $(elem);
        let key = target.data("key");
        let val = target.val();

        let data = Session.get(VIDEO_MERGER_DATA);

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if (key == "files") {
            val = target.data("file");

            let array = data.files;

            if (Array.isArray(array)) {
                if (!array.includes(val)) {
                    array.push(val);
                }
            }else{
                array = [val];
            }

            val = array;
        }

        data[key] = val;

        Session.set(VIDEO_MERGER_DATA, data);


    });

});

Template.Media_drive.events({
    'click [pd-popup-open]': function (e, tmpl) {
        let fileId = $(e.currentTarget).data("file");

        if (fileId) {
            Session.set(MEDIA_EDITING_FILE_ID, fileId); //set id session to update findOne in autorun
        }

    },
    'click .js-delete': function (event, tmpl) {
        event.preventDefault();
        let id = event.target.id;

        Files.update(id, {
            $set: {
                deleting: true,
                delete_stamp: new Date().getTime()
            }
        })

        Meteor.call("files.remove", id, function (err, result) {
            if (err) {
                //console.log(err);
            } else {
                //console.log(result);
                tmpl.$(".popup-close").click();
            }
        });
    },
    'click .js-colllection-remove-file': function (e, tmpl) {
        let target = $(e.currentTarget);
        let index = target.data("index");
        //get array
        let array = Session.get(COLLECTION_CREATE_FILES);
        //remove index
        array.splice(index, 1);
        //save array
        Session.set(COLLECTION_CREATE_FILES, array);

    },
    'click .js-create-collection': function (e, tmpl) {
        let data = Session.get(VIDEO_MERGER_DATA);
        let array = data.files;
        let title = data.title;

        //console.log(data);
        if (!array || !title) {
            //console.log("incorrect data");
            return;
        }


        var form_data = new FormData(); // Creating object of FormData class
        form_data.append("title", title);
        form_data.append("files", array); // Appending parameter named file with properties of file_field to form_data
        form_data.append("user_id", Meteor.userId()); // Adding extra parameters to form_data
        $.ajax({
            url: Meteor.settings.public.api.storage + "/files/video/merger", // Upload Script
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data, // Setting the data attribute of ajax with file_data
            type: 'post',
            success: function (data) {
                // Do something after Ajax completes 
                tmpl.$("[pd-popup-close='popupCreateCollection']").click();
            },
            error: function (err) {
                if(err.status != 200){
                    console.log(err.message);
                }
            }
        });

    },
});

Template.Media_drive.helpers({
    'collectionFiles': function () {
        let data = Session.get(VIDEO_MERGER_DATA);

        if(data && data.files)
            return data.files;

        return [];
    },
    'queryType': function (check) {
        let fileType = Session.get(MEDIA_DRIVE_TYPE);

        if (check)
            return check == fileType ? true : false;

        return fileType;
    },
    'listFiles': function () {
        const fileType = Session.get(MEDIA_DRIVE_TYPE);
        let queryType = fileType.substring(0, 3);

        if (fileType == "other") {
            return Files.find({ "is_video": { $exists: false }, "is_image": { $exists: false }, "deleting": { $exists: false } });
        } else {
            return Files.find({ "file.mimetype": { $regex: ".*" + queryType + ".*" }, "deleting": { $exists: false } })
        }
    },
    'editingFile': function () {
        let file = Session.get(MEDIA_EDITING_FILE);
        return file;
    }
});
