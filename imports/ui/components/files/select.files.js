import "./select.files.html";

Template.select_files.helpers({
    'files': function(){
        let tmpl = Template.instance();
        let fileTypes = tmpl.data.fileTypes;

        return [];
    }
})

Template.select_files.events({
    'click .js-file': function(e, tmpl){
        let elem = $(e.target);
        $(document).trigger(tmpl.data.eventId, [elem]);
    }
})