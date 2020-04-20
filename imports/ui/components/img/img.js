import './img.html';


Template.img.onCreated(function () {
    this.file = new ReactiveVar(this.data.file);
    this.otherFile = new ReactiveVar(false);
    this.src = new ReactiveVar();

})

Template.img.helpers({
    'docChanged': function (doc) {
        //console.log(doc)
        Template.instance().file.set(doc);
        return "";
    },
    'isOtherFile': function(){
        return Template.instance().otherFile.get();
    },
    'src': function () {
        let tmpl = Template.instance();
        return tmpl.src.get();
    }
});

Template.img.events({
    'click .js-fullscreen': function (e, tmpl) {
        let link = $(e.currentTarget).data("link");
        //console.log(link);
        var win = window.open(link, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
    },
});

Template.img.onRendered(function () {
    let self = this;

    this.autorun(function () {

        let file = self.file.get();
        //console.log(file);

        if (file) {

            let fileUrls = fileUrl(file._id);

            if (!fileUrls) {
                return;
            }else if(fileUrls.type == "other"){
                self.$(".thumbnail-hover").data("link", fileUrls.main);
                self.otherFile.set(true);
                return;
            }

            let error = false;
            let loadAttempts = 1;

            //get second node of template
            //use this object reference so that jquery does not find multiple elemnts -> prevents conflict
            let elm = self.$("#thumbnail-" + file._id);


            elm.on("error", function () {
                error = true;
                if (loadAttempts <= 3) {
                    setTimeout(() => {
                        loadAttempts++;
                        //this.src = this.src;
                        self.src.set(this.src);
                    }, 1000);
                } else {
                    console.log("no more attemps to load image...");
                }


            });

            elm.on("load", function () {
                //here preload has been succesfully shown and so we now move on to higher quality thumb

                if (file.is_video) {
                    //set gif
                    //elm.attr("src", fileUrls.preview);
                    self.src.set(fileUrls.preview);
                    self.$(".thumbnail-hover").data("link", fileUrls.video);
                } else {
                    //set new src this time with thumb 
                    //elm.attr("src", fileUrls.thumb);
                    self.src.set(fileUrls.thumb);
                    self.$(".thumbnail-hover").data("link", fileUrls.main);
                }
                //unbind event listened so that it does not conflict with other or use memory.
                //also prevents double load.
                elm.unbind('load');

            });

            //load preload image and then follow to onLoad event above
            //elm.attr("src", fileUrls.preload);
            self.src.set(fileUrls.preload);
        }


        /* let url = this.data.url;
        let elm = $(this.lastNode);
        elm.attr("src", url); */
    });
});

