import './media.html'
/* //iimport child media file
import './media.drive.js' */


Template.Media.onCreated(function () {
    this.uploading = new ReactiveVar(false);
    this.uploadPercent = new ReactiveVar(0);
    this.uploadName = new ReactiveVar();
});


Template.Media.helpers({
    'stats': function () {
        let files = Files.find().fetch();
        // do something
        let data = {
            "storage_used": 0,
            "total_files": 0,
            "video_items": 0,
            "image_items": 0,
            "other_items": 0,
        };

        FlowRouter.subsReady(function () {
            /* GET FILES COUNT */
            data.total_files = files.length;
            for (let i = 0; i < files.length; i++) {
                const doc = files[i];
                data.storage_used += doc.file.size;

                let type = doc.file.mimetype.substring(0, 3);
                if (type == "ima") {
                    data.image_items += 1;
                } else if (type == "vid") {
                    data.video_items += 1;
                }else{
                    data.other_items += 1;
                }
            }
        });

        return data;
    },
    'uploadProgress': function () {
        let tmpl = Template.instance();

        if (!tmpl.uploading.get())
            return false;

        return {
            name: tmpl.uploadName.get(),
            percent: tmpl.uploadPercent.get()
        }
    }
});


Template.Media.events({
    'click .js-upload': function (e, tmpl) {
        let target = tmpl.$("#upload-input");

        target.click();
    },
    'change #upload-input': function (e, tmpl) {
        let input = $(e.target);


        if (!input.val()) return

        var fileName = input.val().replace(/^.*[\\\/]/, '')
        tmpl.uploadName.set(fileName);
        tmpl.uploading.set(true);


        if (input[0].files && input[0].files[0]) {
            //do your own request an handle the results
            var file_data = input[0].files[0]; // Getting the properties of file from file field

            var form_data = new FormData(); // Creating object of FormData class
            form_data.append("file", file_data) // Appending parameter named file with properties of file_field to form_data
            form_data.append("user_id", Meteor.userId()) // Adding extra parameters to form_data
            $.ajax({
                url: Meteor.settings.public.api.storage + "/files", // Upload Script
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data, // Setting the data attribute of ajax with file_data
                type: 'post',
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    xhr.upload.onprogress = function (e) {
                        // For uploads
                        if (e.lengthComputable) {
                            //(e.loaded / e.total) * 100;
                            tmpl.uploadPercent.set((e.loaded / e.total) * 100);
                        }
                    };
                    return xhr;
                },
                success: function (data) {
                    // Do something after Ajax completes 
                    console.log(data);
                    tmpl.uploading.set(false);
                },
                error: function (err) {
                    tmpl.uploading.set(false);
                }
            });

        }

    }
});