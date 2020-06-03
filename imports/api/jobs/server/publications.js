import { Meteor } from 'meteor/meteor';
import '../jobs.collection.js';

Meteor.publish('jobs.all', function () {
    //console.log(Files.find().fetch());
    //Files.insert({"name": "test_file"});
    return Jobs.find({"user_id": this.userId });
});


