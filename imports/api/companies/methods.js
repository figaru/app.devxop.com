// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Companies } from './companies.js';

Meteor.methods({
  'companies.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Companies.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
});
