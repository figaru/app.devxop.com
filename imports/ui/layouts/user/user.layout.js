import './user.layout.html';

Template.App_user.onCreated(function () {
    this.parentPopup = new ReactiveVar();
});

Template.App_user.onRendered(() => {

    Tracker.autorun(function () {

        Session.get("route-event");
        /* Make current route buttons selected! */
        $(".js-link").removeClass("selected");
        $(".js-link").each((index, elm) => {
            let route = $(elm).data("route");
            let path = FlowRouter.current().path;
            if (path.includes(route)) {
                $(elm).addClass("selected");
            }
        });
    });

});

Template.App_user.helpers({
    'toggleJobs':function(){
        return Session.get(TOGGLE_JOBS);
    },
});

Template.App_user.events({
    //POPUP EVENTS
    'click [pd-popup-open]': (e, tmpl) => {
        let app = $("#app-wrapper");
        app.addClass("popup-toggled");

        var targeted_popup_class = $(e.currentTarget).attr('pd-popup-open');


        $('[pd-popup="' + targeted_popup_class + '"]').fadeIn(100);

        e.preventDefault();
    },
    'click [pd-popup-close]': (e, tmpl) => {
        var targeted_popup_class = $(e.target).attr('pd-popup-close');

        let popup = $('[pd-popup="' + targeted_popup_class + '"]');

        if (popup[0]) {
            $('[pd-popup="' + targeted_popup_class + '"]').fadeOut(0);

            let hasParent = false;
            $(".popup").each(function(){
                if($(this).css("display") == "block"){
                    hasParent = true;
                }
                
            });

            if(!hasParent){
                //console.log(hasParent);
                $("#app-wrapper").removeClass("popup-toggled"); 
            }
            
        }



        e.preventDefault();
    },

    //GLOBAL LINK
    'click .js-link': function (e) {
        let target = $(e.currentTarget);
        let route = target.data("route");
        let params = target.data("params");
        let query = target.data("query");

        if (route) {

            if (params || query) {
                if (typeof params == "string") {
                    params = JSON.parse(params);
                }

                if (typeof query == "string") {
                    query = JSON.parse(query);
                }

                var path = FlowRouter.path(route, params, query);
                //console.log(path);
                FlowRouter.go(path);
            } else {
                FlowRouter.go(route);
            }
        }
    },

    //DRAWER TOGGLE
    'click #toggle-nav-drawer': function (ev) {
        let target = $("#app-content");
        if (target.hasClass("drawer-toggled")) {
            target.removeClass("drawer-toggled");
        } else {
            target.addClass("drawer-toggled");
        }
    }
});

