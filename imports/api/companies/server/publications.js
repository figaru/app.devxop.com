// All links-related publications

import { Meteor } from 'meteor/meteor';
import '../companies.js';

Meteor.publish('companies.all', function () {
  return Companies.find();
});
