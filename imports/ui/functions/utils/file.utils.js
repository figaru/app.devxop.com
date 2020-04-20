fileUrl = function(id, key){
    let file = Files.findOne({"_id": id});

    if(!file){
        return null;
    }

    let data = {
        url: Meteor.settings.public.api.storage + "/files/" + Meteor.userId() + "/" + id
    }

    if(file.is_image){
        data["type"] = "image";
        data["preload"] = data.url + "/preload.jpeg";
        data["thumb"] = data.url + "/thumb.jpeg";
        data["main"] = data.url + "/main.jpeg";
    }else if(file.is_video){
        data["type"] = "video";
        data["preload"] = data.url + "/preload.jpeg";
        data["thumb"] = data.url + "/thumb.jpeg";
        data["preview"] = data.url + "/preview.gif";
        data["video"] = data.url + "/video." + file.extension;
    }else{
        data["type"] = "other";
        data["main"] = data.url + "/" + file.file.name; 
    }

    //console.log(data);

    if(key){
        return data[key];
    }

    return  data;
}