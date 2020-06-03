import { Mongo } from 'meteor/mongo';

Jobs = new Mongo.Collection('jobs');


Jobs.allow({
    insert: function (userId, doc) {
        /*  Lets deny all client file inserts
            *all files inserted are now being handled by the db server, 
            wich will hadle and store a new file uploaded by the user. 
        */
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
            return true;
        }

        return false;
    },
});