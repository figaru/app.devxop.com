import { Meteor } from 'meteor/meteor';
import '../devices.collection.js';

Meteor.publish('devices.all', function () {
    //console.log(Files.find().fetch());
    //Files.insert({"name": "test_file"});
    return Devices.find({ "user_id": this.userId });
});

Meteor.publish('devices.allByType', function (type) {

    return Devices.find({ "user_id": this.userId, "file.mimetype": { $regex: ".*" + type + ".*" } });
});


