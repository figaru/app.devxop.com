import "./creator.textEditor.html";

Template.creator_textEditor.onRendered(function(){
    Tracker.autorun(function () {
        let item = CreatorItems.findOne({ "selected": true });

        let instance = this;
        setTimeout(() => {
            instance.$('.color-container').each(function (i, obj) {
                if ($(this).find('.a-color-picker').length == 1) {
                    //do nothing -> box already containes color picker
                } else {
                    let elem = $(this);
                    ColorPicker.from(elem)
                        .on('change', (picker, color) => {
                            elem.data("value", color);
                            $(document).trigger("creatorEvent", [elem]);
                        });
                }

            })
        }, 500);
    });
});

Template.creator_textEditor.events({
    'click .js-edit-text': function (e, tmpl) {
        let elem = $(e.currentTarget);
        $(document).trigger("creatorEvent", [elem]);
    },
});

Template.creator_textEditor.helpers({
    'get_font_list': function(){
        return [
            {
                "key": "font-family",
                "value": '"Roboto", sans-serif',
                "label": "Roboto"
            },
            {
                "key": "font-family",
                "value": "Arial, Helvetica, sans-serif",
                "label": "Arial"
            },
            {
                "key": "font-family",
                "value": 'Comic Sans MS", cursive, sans-serif',
                "label": "Comic Sans"
            },
            {
                "key": "font-family",
                "value": 'Impact, Charcoal, sans-serif',
                "label": "Impact"
            },
            {
                "key": "font-family",
                "value": '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                "label": "Lucida Sans"
            },
            {
                "key": "font-family",
                "value": 'Tahoma, Geneva, sans-serif',
                "label": "Tahoma"
            },
            {
                "key": "font-family",
                "value": '"Trebuchet MS", Helvetica, sans-serif',
                "label": "Trebuchet"
            },
            {
                "key": "font-family",
                "value": 'Verdana, Geneva, sans-serif',
                "label": "Verdana"
            },
            {
                "key": "font-family",
                "value": 'Georgia, serif',
                "label": "Georgia"
            },
            {
                "key": "font-family",
                "value": '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                "label": "Palatino"
            },
            {
                "key": "font-family",
                "value": '"Times New Roman", Times, serif',
                "label": "Times New Roman"
            },
            {
                "key": "font-family",
                "value": '"Courier New", Courier, monospace',
                "label": "Courier New"
            },
            {
                "key": "font-family",
                "value": '"Lucida Console", Monaco, monospace',
                "label": "Lucida Console"
            }
        ];
    },
    'get_text_values': function () {

        let item = CreatorTexts.findOne({"selected": true}); //this == text

        if(!item){
            return;
        }
        
        let styles = item["style"];

        let values = {
            text: "",
            font_size: "",
            color: "",
            bold: "",
            italic: "",
            underline: "",
            line_through: ""
        }

        if (item && styles) {
            values.text = item.text;
            
            Object.keys(styles).forEach(function (key, i, val) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object 
                switch (key) {
                    case "font-size":
                        values.font_size = styles[key].replace("%", "");
                        values.font_size = Math.round(((vpWidth / 100) * values.font_size)) + "px";
                        break;
                    case "color":
                        values.color = styles[key];
                        break;
                    case "font-weight":
                        if (styles[key] == "bold") values.bold = "selected";
                        break;
                    case "font-style":
                        if (styles[key] == "italic") values.italic = "selected";
                        break;
                    case "text-decoration":
                        if (styles[key] == "underline") values.underline = "selected";
                        if (styles[key] == "line-through") values.line_through = "selected";
                        break;
                    default:
                        break;
                }
            });
        }



        return values;
    }
});