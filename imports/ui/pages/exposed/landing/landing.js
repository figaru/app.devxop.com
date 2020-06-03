import './landing.html';

/* import '../../components/hello/hello.js';
import '../../components/info/info.js'; */

Template.Landing_overview.onRendered(function(){

    let self = this;
    $(window).on('scroll', function() {
        var top = $(window).scrollTop();

        if(top > 0){
            self.$(".landing-header").addClass("fixed");
        }else{
            self.$(".landing-header").removeClass("fixed");
        }
    });
});

Template.Landing_overview.onDestroyed(function(){
    //remove duplicate events
    $(window).unbind("scroll");
});