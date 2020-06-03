import './creator.html';

//component
import './creator.textEditor.js';

CreatorViewport = new Mongo.Collection(null);
CreatorLayers = new Mongo.Collection(null);
CreatorItems = new Mongo.Collection(null);
CreatorTexts = new Mongo.Collection(null);
CreatorGuides = new Mongo.Collection(null);

const CREATOR_SELECTED_ITEM = "creator.item.selected";
const CREATOR_SELECTED_GUIDE = "creator.guide.selected";


const NEW_LAYER_NAME = "creator.layer.new.name";

const NEW_ITEM_NAME = "creator.item.new.name";

const ITEM_TYPE_1 = "2.cols.2.rows";

vpWidth = 0; //global access from component


Template.registerHelper('parseStyle', function (style) {
    if (!style || Object.keys(style).length == 0) {
        return;
    }

    return createMarkup(style);
});


resizeViewport = function () {
    //set right dimensions for 1080p -> based on width of container
    let viewport = $("#viewport");
    let width = viewport.outerWidth();
    vpWidth = width;
    //+77% portrait
    //+56% landscape
    viewport.css("height", (width * 1.77777777777778) + "px");


    //force update Viewport
    let layer = CreatorLayers.findOne();
    CreatorLayers.update(layer._id, {
        $set: {
            resize: new Date().getTime()
        }
    });

    //resize font

}

Template.Creator.onRendered(function () {
    //set session initialss
    Session.set(CREATOR_SELECTED_ITEM, null);
    Session.set(NEW_LAYER_NAME, null);

    let textPrimary = CreatorTexts.insert({
        text: "",
        style: {}
    });

    let textSecondary = CreatorTexts.insert({
        text: "",
        style: {}
    });

    let textExtra = CreatorTexts.insert({
        text: "",
        style: {}
    });

    let itemId = CreatorItems.insert({
        name: "Item 1",
        type: "item-type-1",
        primary_text: textPrimary,
        secondary_text: textSecondary,
        extra_text: textExtra,
        style: {}
    });

    let itemImageId = CreatorItems.insert({
        name: "Image 1",
        type: "image",
        src: "",
        file_id: "",
        style: {}
    });

    CreatorLayers.insert({
        name: "Layer 1",
        visible: true,
        items: [itemId, itemImageId]
    });


    //make render page full width
    $(".render").addClass("full-width");

    //set right dimensions for 1080p
    resizeViewport();

    let self = this;

    $(window).on("resize", function () {
        resizeViewport();
    });

    /* $(document).on('keydown', (e) => {
        let item = CreatorItems.findOne({ "selected": true });
        if (item) {
            let viewport = self.$(".creator-viewport");
            let style = item.style;

            let pHeight = viewport.outerHeight();
            let pWidth = viewport.outerWidth();

            let incTop = (1 / pHeight) * 100;
            let incLeft = (1 / pWidth) * 100;

            let styleTop = parseFloat(item.style.top.replace("%", ""));
            let styleLeft = parseFloat(item.style.left.replace("%", ""));


            if (e.which == '38') {
                // up arrow
                style["top"] = (styleTop - incTop) + "%";
            }
            else if (e.which == '40') {
                // down arrow
                style["top"] = (styleTop + incTop) + "%";
            }
            else if (e.which == '37') {
                // left arrow
                style["left"] = (styleLeft - incLeft) + "%";
            }
            else if (e.which == '39') {
                // right arrow
                style["left"] = (styleLeft + incLeft) + "%";
            }

            CreatorItems.update(item._id, {
                $set: {
                    style: style
                }
            });
        }


    }); */

    $(document).on("mouseup", function (e) {
        let item = CreatorItems.findOne({ "selected": true });
        var container = $(".item");

        var viewport = $("#viewport");

        // if the target of the click isn't the container nor a descendant of the container
        if (item && !container.is(e.target) && container.has(e.target).length === 0) {

            if (viewport.has(e.target).length > 0)
                CreatorItems.update(item._id, {
                    $set: {
                        selected: false
                    }
                });
        }
    });


    $(document).on("creatorEvent", function (e, elem) {
        let target = $(elem);
        let key = target.data("key");
        let subKey = target.data("sub-key");
        let metric = target.data("metric");
        let val = target.val();
        let data = {};
        let item = CreatorItems.findOne({ "selected": true });
        let viewportWidth = $("#viewport").outerWidth();

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if (key == "new-layer-name") {
            Session.set(NEW_LAYER_NAME, val);
            return;
        } else if (key == "new-item-name") {
            Session.set(NEW_ITEM_NAME, val);
            return;
        } else if (key == "item_style") {
            let item = CreatorItems.findOne({ "selected": true });

            let style = item.style || {};
            if (subKey == "padding") {
                let sizeString = style[subKey];
                let size = 1.48;
                let pxInc = ((1 / viewportWidth) * 100);
                //let pxInc = 1.48;

                if (sizeString) {
                    size = parseFloat(sizeString.replace("%", ""))
                } else {
                    size = pxInc;
                }

                if (val == "inc") {
                    size = size + pxInc;
                } else if (val == "sub") {
                    size = size > 0 ? size - pxInc : size;
                }

                style[subKey] = size + "%";
                val = size;

            }

            CreatorItems.update(item._id, {
                $set: {
                    style: style
                }
            });

            return;
        } else if (key == "text") {
            key = "text"
            let text = CreatorTexts.findOne({ "selected": true });

            CreatorTexts.update(text._id, {
                $set: {
                    text: val
                }
            });

            return;
        }else if(key == "font-family"){
            let text = CreatorTexts.findOne({ "selected": true });

            let style = text.style || {};

            style[key] = val;

            CreatorTexts.update(text._id, {
                $set: {
                    style: style
                }
            });

            return;
        } else if(key == "image-src"){
            let item = CreatorItems.findOne({ "selected": true });

            CreatorItems.update(item._id, {
                $set: {
                    src: val
                }
            });

            return;
        } else if (key == "text_style") {
            let text = CreatorTexts.findOne({ "selected": true });

            let style = text.style || {};

            console.log(key);
            console.log(subKey);
            console.log(val);
            if (subKey == "font-size") {
                let sizeString = style[subKey];
                let size = 1.48;
                let pxInc = ((1 / viewportWidth) * 100);
                //let pxInc = 1.48;

                if (sizeString) {
                    size = parseFloat(sizeString.replace("%", ""))
                }

                if (val == "inc") {
                    size = size + pxInc;
                } else if (val == "sub") {
                    size = size > 0 ? size - pxInc : size;
                }

                style[subKey] = size + "%";
                val = size;

            } else {
                if (style[subKey] != val) {
                    style[subKey] = val;
                } else {
                    style[subKey] = "";
                    val = "";
                }
            }

            console.log(style);

            CreatorTexts.update(text._id, {
                $set: {
                    style: style
                }
            });

            return;
        }

        CreatorItems.update(item._id, {
            $set: data
        });
    });


});

Template.Creator.onDestroyed(() => {
    $(document).off('keyup');
    $(document).off('mouseup');
    $(document).off('creatorEvent');

    $(".render").removeClass("full-width");
});

Template.Creator.helpers({
    'list_layers': function () {
        return CreatorLayers.find().fetch();
    },
    'listItems': function () {
        setDraggables();

        return CreatorItems.find().fetch();
    },
    'listGuides': function () {
        setGuideDrag();
        return CreatorGuides.find().fetch();
    },
    'selectedItem': function () {
        return Session.get(CREATOR_SELECTED_ITEM);
    },


    /* LAYER RELATED HELPERS */
    'get_selected_layer': function () {
        return CreatorLayers.findOne({ "selected": true });
    },
    'is_layer_selected': function (layer) {
        //return class selected
        return layer.selected ? "selected" : "";
    },
    'is_layer_visible': function (layer) {
        //return class selected
        return layer.visible ? "visibility" : "visibility_off";
    },


    /* ITEMS RELATED HELPERS */
    'list_items': function (layer) {
        setDraggables();
        return CreatorItems.find({ "_id": { $in: layer.items } }).fetch();
    },
    'is_item_type': function (item, type) {
        return item.type == type ? true : false;
    },
    'is_item_selected': function (item) {
        return item.selected == true ? "selected" : "";
    },
    'get_selected_item': function () {
        return CreatorItems.findOne({ "selected": true })
    },
    'get_item_values': function () {

        if (!this)
            return;

        let item = this; //this == text
        let styles = item["style"];

        let values = {
            width: "",
            height: "",
            padding: ""
        }

        if (item && styles) {
            values.text = item.text;

            Object.keys(styles).forEach(function (key, i, val) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object 
                switch (key) {
                    case "width":
                        values.width = parseFloat(styles[key].replace("%", ""));
                        values.width = Math.round(values.width, 1);
                        break;
                    case "height":
                        values.height = parseFloat(styles[key].replace("%", ""));
                        values.height = Math.round(values.height, 1);
                        break;
                    case "padding":
                        values.padding = styles[key].replace("%", "");
                        values.padding = Math.round(((vpWidth / 100) * values.padding)) + "px";
                        break;
                    case "color":
                        values.color = styles[key];
                        break;
                    default:
                        break;
                }
            });
        }



        return values;
    },


    /* TEXT HELPERS */
    'get_text': function (textId) {
        return CreatorTexts.findOne(textId);
    },
    'get_selected_text': function () {
        return CreatorTexts.findOne({ "selected": true });
    },
    'get_selected_text_editor': function () {
        let text = CreatorTexts.findOne({ "selected": true });

        return text && text._id == this._id ? text : null;
    },
    'is_selected_text': function () {

        let text = CreatorTexts.findOne({ "selected": true });

        return text && text._id == this._id ? "selected" : "";
    },

    /* IMAGE HELPERS */
    'has_image_src': function(){
        return this.src != "undefined" ? true : false;
    }
});

Template.Creator.events({
    'change .js-input-image': function(e){
        let input = $(e.target)[0];
        if (input.files && input.files[0]) {
            let objUrl = URL.createObjectURL(input.files[0]); // set src to blob url
            console.log(objUrl);

            let item = CreatorItems.findOne({ "selected": true });

            CreatorItems.update(item._id, {
                $set: { src: objUrl }
            });
    
        }
    },
    'click .js-delete-item': function(){
        let item = CreatorItems.findOne({ "selected": true });

        CreatorItems.remove(item._id);
    },
    'click .js-edit-item': function (e, tmpl) {
        let elem = $(e.currentTarget);
        $(document).trigger("creatorEvent", [elem]);
    },
    'change .js-edit-item': function (e, tmpl) {
        let key = $(e.target).data("key");
        let val = $(e.target).val();
        let item = CreatorItems.findOne({ "selected": true });

        let style = item.style || {};

        if (key == "width" || key == "height") {
            val = val + "%";
        }

        style[key] = val;

        CreatorItems.update(item._id, {
            $set: { style: style }
        });

    },
    'click .js-create-guide': function (e, tmpl) {
        let guideNum = $("#guide-num").val();
        let orientation = $(e.target).data("orientation");
        let count = CreatorGuides.find().count();
        count++;

        let viewport = $(".creator-viewport");
        let pHeight = viewport.outerHeight();
        let pWidth = viewport.outerWidth();

        //calculate percentage
        // left / parent width = 0.625 * 100
        let finalLeft = (guideNum / pWidth) * 100;
        let finalTop = (guideNum / pHeight) * 100;

        style = {};

        if (orientation == "x") {
            //horizontal
            style["top"] = finalTop + "%";
        } else if (orientation == "y") {
            //vertical
            style["left"] = finalLeft + "%";
        }


        CreatorGuides.insert({
            name: "Guide-" + count,
            orientation: orientation,
            style: style
        });

    },

    /* LAYER RELATED EVENTS */
    'click .js-create-layer': function (e, tmpl) {
        let name = Session.get(NEW_LAYER_NAME);

        if (name.length > 0) {
            CreatorLayers.insert({
                name: name,
                visible: true,
                items: []
            });

            tmpl.$(".popup-close").click();
        } else {
            console.log("no text in name");
        }
    },
    'click .js-toggle-layer-visibility': function (e, tmpl) {
        let layerId = $(e.currentTarget).data("layer-id");
        let layer = CreatorLayers.findOne(layerId);

        CreatorLayers.update(layerId, {
            $set: {
                visible: !layer.visible
            }
        });
    },
    'click .js-select-layer': function (e, tmpl) {
        let layerId = $(e.currentTarget).data("layer-id");
        let selectedLayer = CreatorLayers.findOne({ "selected": true });
        if (selectedLayer) {
            CreatorLayers.update(selectedLayer._id, {
                $set: {
                    selected: false
                }
            });
        }

        CreatorLayers.update(layerId, {
            $set: {
                selected: true
            }
        });
    },
    'click .js-select-text': function (e, tmpl) {
        let textId = $(e.currentTarget).data("text-id");
        let selectedText = CreatorTexts.findOne({ "selected": true });
        if (selectedText) {
            CreatorTexts.update(selectedText._id, {
                $set: {
                    selected: false
                }
            });
        }

        CreatorTexts.update(textId, {
            $set: {
                selected: true
            }
        });
    },





    /* ITEM RELATED EVENTS */
    'click .js-create-item': function (e, tmpl) {
        let name = Session.get(NEW_ITEM_NAME);
        let layer = CreatorLayers.findOne({ "selected": true });

        if (name.length > 0) {
            /* let textPrimary = CreatorTexts.insert({
                text: "",
                style: {}
            });

            let textSecondary = CreatorTexts.insert({
                text: "",
                style: {}
            });

            let textExtra = CreatorTexts.insert({
                text: "",
                style: {}
            });

            let itemId = CreatorItems.insert({
                name: name,
                type: "item-type-1",
                primary_text: textPrimary,
                secondary_text: textSecondary,
                extra_text: textExtra,
                style: {}
            }); */

            let itemImageId = CreatorItems.insert({
                name: name,
                type: "image",
                src: "",
                file_id: "",
                style: {}
            });


            let layerItems = layer.items;
            /* layerItems.push(itemId); */
            layerItems.push(itemImageId);

            CreatorLayers.update(layer._id, {
                $set: {
                    items: layerItems
                }
            })

            tmpl.$(".popup-close").click();
        } else {
            console.log("no text in name");
        }
    },
    'click .js-select-item': function (e, tmpl) {
        let itemId = $(e.currentTarget).data("item-id");

        let selected = CreatorItems.findOne({ "selected": true });

        if (selected && selected._id != itemId) {
            CreatorItems.update(selected._id, {
                $set: {
                    selected: false
                }
            });
        }

        CreatorItems.update(itemId, {
            $set: {
                selected: true
            }
        });
    },


    /* 'click .js-create-item': function (e) {
        let type = $(e.target).data("type");
        let count = CreatorItems.find().count();
        count++;

        CreatorItems.insert({
            name: "Items-" + count,
            type: type,
            primary_text: "Primary text for content item",
            secondary_text: "Secondary text",
            extra_text: "Extras",
            style: {
                "width": "100%",
                "height": "fit-content",
                "top": "15%",
                "left": "15%"
            },
            primary_text_style: {

            },
        });
    }, */
    'mousedown .draggable': function (e, tmpl) {
        let itemId = $(e.currentTarget).data("item-id");

        let selected = CreatorItems.findOne({ "selected": true });

        if (selected && selected._id != itemId) {
            CreatorItems.update(selected._id, {
                $set: {
                    selected: false
                }
            });
        }

        CreatorItems.update(itemId, {
            $set: {
                selected: true
            }
        });

        Session.set(CREATOR_SELECTED_ITEM, CreatorItems.findOne(itemId));
    },
    'mousedown .js-guide-line': function (e, tmpl) {
        let guideId = $(e.currentTarget).data("guide-id");

        Session.set(CREATOR_SELECTED_GUIDE, CreatorGuides.findOne(guideId));
    }
});

setGuideDrag = function () {
    setTimeout(function () {
        $(".x").each(function () {
            $(this).draggable({
                axis: "y",
                containment: "#viewport",
                stop: function () {
                    var $this = $(this);
                    let guideId = $this.data("guide-id");

                    var thisPos = $this.position();
                    var parent = $(".creator-viewport");
                    let pHeight = parent.outerHeight();

                    //calculate percentage
                    // left / parent width = 0.625 * 100
                    let finalTop = (thisPos.top / pHeight) * 100;

                    let item = CreatorGuides.findOne(guideId);
                    if (item) {
                        let style = item.style;
                        style["top"] = finalTop + "%";
                        style["left"] = 0;
                        CreatorGuides.update(guideId, {
                            $set: {
                                style: style
                            }
                        });

                    }

                }
            });
        });
        $(".y").each(function () {
            $(this).draggable({
                axis: "x",
                containment: "#viewport",
                stop: function () {
                    var $this = $(this);
                    let guideId = $this.data("guide-id");

                    var thisPos = $this.position();
                    var parent = $(".creator-viewport");
                    let pWidth = parent.outerWidth();

                    //calculate percentage
                    // left / parent width = 0.625 * 100
                    let finalLeft = (thisPos.left / pWidth) * 100;

                    let item = CreatorGuides.findOne(guideId);
                    if (item) {
                        let style = item.style;
                        style["top"] = 0 + "%";
                        style["left"] = finalLeft + "%";

                        CreatorGuides.update(guideId, {
                            $set: {
                                style: style
                            }
                        });

                    }

                }
            });
        });
    }, 200)
}

setDraggables = function () {
    setTimeout(function () {
        $(".resizable").each(function () {
            $(this).resizable({
                grid: 1,
                containment: "#viewport",
                stop: function () {
                    let $this = $(this);
                    let itemId = $this.data("item-id");

                    let pHeight = $this.parent().outerHeight();
                    let pWidth = $this.parent().outerWidth();

                    let width = $this.outerWidth();
                    let height = $this.outerHeight();

                    console.log(height);
                    console.log(width);

                    let finalWidth = (width / pWidth) * 100;
                    let finalHeight = (height / pHeight) * 100;

                    let item = CreatorItems.findOne(itemId);
                    if (item) {
                        let style = item.style;
                        style["width"] = Math.round(finalWidth) + "%";
                        style["height"] = Math.round(finalHeight) + "%";

                        CreatorItems.update(itemId, {
                            $set: {
                                style: style
                            }
                        });

                    }
                }
            });
        });
        $(".draggable").each(function () {
            $(this).draggable({
                containment: "#viewport",
                start: function () {
                    $(this).addClass("dragging");
                },
                stop: function () {
                    $(this).removeClass("dragging");
                    var $this = $(this);
                    let itemId = $this.data("item-id");

                    var thisPos = $this.position();
                    var parentPos = $this.parent().position();

                    var x = thisPos.left - parentPos.left;
                    var y = thisPos.top - parentPos.top;

                    var parent = $("#viewport");

                    let pHeight = parent.outerHeight();
                    let pWidth = parent.outerWidth();

                    //calculate percentage
                    // left / parent width = 0.625 * 100
                    let finalLeft = (x / pWidth) * 100;
                    let finalTop = (y / pHeight) * 100;


                    let item = CreatorItems.findOne(itemId);
                    if (item) {
                        let style = item.style;
                        style["top"] = finalTop + "%";
                        style["left"] = finalLeft + "%";

                        CreatorItems.update(itemId, {
                            $set: {
                                style: style
                            }
                        });

                    }

                }
            });
        });
    }, 200)
}


createMarkup = function (obj) {
    let viewport = $("#viewport");
    let width = viewport.outerWidth();

    var keys = Object.keys(obj)
    if (!keys.length) return ''
    var i, len = keys.length
    var result = ''

    for (i = 0; i < len; i++) {
        var key = keys[i]
        var val = obj[key]

        if (key == "font-size") {
            //get px based on % relative to view port
            val = val.replace("%", "");
            val = ((width / 100) * val) + "px";
        }


        result += key + ':' + val + ';'
    }

    return result
}