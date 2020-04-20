import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import './files.collection.js';

const httpDeleteAsync = (url, data) =>
    new Promise((resolve, reject) => {
        HTTP.call("DELETE", url, {
            data: data
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

Meteor.methods({
  'files.remove': async function (id) {

    let file = Files.findOne(id);

    if (file && file.user_id == this.userId) {
      let data = {
        'user_id': file.user_id,
        'file_id': file._id
      };

      try {
        const response = await httpDeleteAsync(Meteor.settings.public.api.storage + "/files", data);
        return response;
      } catch (ex) {
        console.log(ex);
        throw new Meteor.Error('some-error', 'An error has happened');
      }


    }


  },
  'files.storageUsed': async function () {
    let pipeline = [
      { $match: { user_id: this.userId } }, {
        $group: {
          _id: null,
          total: {
            $sum: "$file.size"
          },
        }
      }];

    const files = await Files.rawCollection().aggregate(pipeline).toArray();

    return files;
  },
  'files.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Files.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
});
