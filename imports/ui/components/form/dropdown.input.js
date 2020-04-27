import './dropdown.input.html';


Template.dropdown_input.onCreated(function () {
    this.dropdownSelection = new ReactiveVar(this.data.selected);
    /* console.log(this); */
});

Template.dropdown_input.onRendered(function () {

});

Template.dropdown_input.helpers({
    'dropdownSelection': function () {
        let tmpl = Template.instance();
        return tmpl.dropdownSelection.get();
    }
});

Template.dropdown_input.events({
    'click .js-dropdown': function (e, tmpl) {
        let target = $(e.currentTarget);
        let pos = target.offset();


        tmpl.$(".shell").css({
            "width": tmpl.$(".dropdown-container").width(),
            "top": pos.top,
            "left": pos.left
        })
        tmpl.$(".dropdown-popup").fadeIn(200);
    },
    'click .js-backdrop': function (e, tmpl) {
        tmpl.$(".dropdown-popup").fadeOut(200);
    },
    'click .js-item': function (e, tmpl) {
        let elem = $(e.target);

        tmpl.dropdownSelection.set(elem.data("label"));
        $(document).trigger(tmpl.data.eventId, [elem]);

        tmpl.$(".dropdown-popup").fadeOut(200);
    }
})