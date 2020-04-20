import './dropdown.input.html';

Template.dropdown_input.onRendered(function () {
    
});

Template.dropdown_input.events({
    'click .js-dropdown': function(e, tmpl){
        let target = $(e.currentTarget);
        let pos = target.offset();
        

        tmpl.$(".shell").css({
            "width": tmpl.$(".dropdown-container").width(),
            "top": pos.top,
            "left": pos.left
        })
        tmpl.$(".dropdown-popup").fadeIn(200);
    },
    'click .js-backdrop': function(e, tmpl){
        tmpl.$(".dropdown-popup").fadeOut(200);
    },
    'click .js-item': function(e, tmpl){
        let elem = $(e.target);
        $(document).trigger(tmpl.data.eventId, [elem]);

        tmpl.$(".dropdown-popup").fadeOut(200);
    }
})