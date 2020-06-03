import { Mongo } from 'meteor/mongo';

Devices = new Mongo.Collection('devices');


Devices.allow({
    insert: function (userId, doc) {
        /*  Lets deny all client file inserts
            *all files inserted are now being handled by the db server, 
            wich will hadle and store a new file uploaded by the user. 
        */

        doc["v_id"] = 0;

        return false;
    },
    remove: function (userId, doc) {

        if (doc["user_id"] == userId) {
            return true;
        }

        return false;
    },
    update: function (userId, doc) {
        
        if (doc["user_id"] == userId) {
            Meteor.call("devices.version.update", doc._id, doc["v_id"]);
            Meteor.call("devices.emit.update", doc._id);            
            return true;
        }

        return false;
    }
});