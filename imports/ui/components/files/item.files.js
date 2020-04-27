import './item.files.html';



var slideIndex = 0;
var timeOut;
function stopSlides() {
    clearTimeout(timeOut);
}
function showSlides() {
    //important not to duplicate and have multiple events
    stopSlides();

    let slides = $("img.slide-item");
    /* console.log(slides); */
    if (slides[0] && slides.length > 1) {
        slides.each(function () {
            $(this).fadeOut(00);
        });

        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1
        }
        //slides[slideIndex - 1].style.display = "block";
        $(slides[slideIndex - 1]).fadeIn(200);

    }else{
        slideIndex = 0;
        $(slides[slideIndex]).fadeIn(0);
    }

    timeOut = setTimeout(showSlides, 3000); // Change image every 2 seconds


}

Template.item_files.onCreated(function () {

    this.slideIndex = new ReactiveVar(0);
    this.file = new ReactiveVar();
    this.files = new ReactiveVar();
    this.otherFile = new ReactiveVar(false);
    this.src = new ReactiveVar();

    //showSlides();
})

Template.item_files.helpers({
    'docChanged': function (doc) {
        let tmpl = Template.instance();
        //console.log("doc changed!");

        let file = tmpl.data.file;
        let files = tmpl.data.files;

        if (!file) {
            if (Array.isArray(files) && files.length > 0) {
                tmpl.files.set(files);
            }
        } else {
            if (isMeteorId(doc)) {
                //doc is id -> find correct file
                tmpl.file.set(Files.findOne(doc));
            } else {
                tmpl.file.set(doc);
            }
        }

        //console.log(doc)

        return;
    },
    'file': function () {
        return Template.instance().file.get();
    },
    'files': function () {
        let filesId = Template.instance().files.get();

        let data = [];

        if (filesId) {

            filesId.forEach(fileId => {
                let file = Files.findOne(fileId);

                let fileUrls = fileUrl(file._id);
                if (file.is_video) {
                    data.push(fileUrls.preview)
                } else if (file.is_image) {
                    data.push(fileUrls.thumb);
                }

            });
        }


        //console.log(data);

        return data;
    },
    'isOtherFile': function () {
        return Template.instance().otherFile.get();
    },
    'src': function () {
        let tmpl = Template.instance();
        return tmpl.src.get();
    }
});

Template.item_files.events({
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

Template.item_files.onRendered(function () {
    let self = this;

    if (this.data.url) {
        self.src.set(this.data.url);
        return;
    }

    this.autorun(function () {

        let file = self.file.get();
        let files = self.files.get();
        /* console.log(file);
        console.log(files); */



        if (Array.isArray(files)) {
            showSlides();
        }

        if (file) {
            let fileUrls = fileUrl(file._id);

            if (!fileUrls) {
                return;
            } else if (fileUrls.type == "other") {
                self.$(".thumbnail-hover").data("link", fileUrls.main);
                self.otherFile.set(true);
                return;
            }

            let error = false;
            let loadAttempts = 1;

            //get second node of template
            //use this object reference so that jquery does not find multiple elemnts -> prevents conflict
            let elm = self.$("#thumbnail-" + file._id);

            /* console.log(elm); */
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
                /* console.log("image loaded"); */
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

