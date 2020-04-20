import './text.input.html';

Template.text_input.onRendered(function () {
    //$(document).trigger('testEvent', [1011]);

    //set initial character count
    let val = this.$(".js-textbox").val();
    var len = val.length;
    this.$(".mention").html(len + " / " + this.data.maxLength)
});

Template.text_input.events({
    'click #outer': function (e, template) {
        //focus on textarea
        template.find(".js-textbox").focus();
    },
    'focusout .js-textbox': function (e, template) {
        //docalculation
        let elem = $(e.target);
        let element = elem[0];
        element.style.height = 16 + "px";

        if(template.data.value != elem.val()){
            $(document).trigger(template.data.eventId, [elem]);
        }
    },
    'focus .js-textbox': function (e, template) {
        let elem = $(e.target);
        let element = elem[0];
        element.style.height = (element.scrollHeight) + "px";
        
    },
    'input .js-textbox': function(e, template){
        let elem = $(e.target);
        let val = elem.val();
        var len = val.length;

        /* elem[0].style.height = (elem[0].scrollHeight) + "px"; */

        //line height = 16 the number we use to calculate a new line
        let lines = val.split(/\r\n|\r|\n/).length;//Math.round(elem[0].scrollHeight / 16);
        elem[0].style.height = (lines * 16) + "px";
        if((lines * 16) < elem[0].scrollHeight){
            elem[0].style.height = (elem[0].scrollHeight) + "px";
        }


        if (len >= template.data.maxLength) {
            elem.val(val.substring(0, template.data.maxLength));
            template.$(".mention").html(template.data.maxLength + " / " + template.data.maxLength);
        }else{
            template.$(".mention").html(len + " / " + template.data.maxLength);
        }

        
    },
    'keyup .js-textbox': delay(function (e, template) {
        let elem = $(e.target);
        //console.log(template.data.value != elem.val());
        //console.log(template.data.value +" : "+ elem.val());
        if(template.data.value != elem.val()){
            $(document).trigger(template.data.eventId, [elem]);
        }
    }, 1500) //only update document after 1.5sec after change
});

function delay(callback, ms) {
    var timer = 0;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }