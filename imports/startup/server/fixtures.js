// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  // if the Links collection is empty
  if (!Companies.findOne()) {
    console.log("no companies... creating one");
    //Create company
    var companyId = Companies.insert({
      name: 'GS Bistro',
      createDate: new Date(),
      active: true
    });

    //Create users
    //Daniel
    userId = Accounts.createUser({
      email: 'daniel@demo.com',
      password: '123',
      profile: {
        username: 'daniel',
        firstName: 'Daniel',
        lastName: 'Abrantes',
        company: companyId
      }
    });
  }

  let devices = Devices.find().fetch();
  
  if (devices.length < 1) {

    console.log("devices inserted");
    Devices.insert({
      "device_id": "4fe84085-6488-4b08-941d-4286dfadd075",
      "user_id": "bxxpwy2cwGNumjWTK",
      "authorization_code": "HlLH4OHd4tH1QMLn2JtHzdbEOSlziVZX8a9BZFkF941",
      "update_stamp": 1560100348116.0,
      "operating_system": "android",
      "device_type": "screen_display",
      "auth": {
        "access_token": "GMNHgFGrUt8AuvkQCqSu4DLlgkPgYH9C0tjB1n5B5AO",
        "refresh_token": "pW-IpP1vCFQvuG8GYfARTLxI03COg6penRJHjfshmpx",
        "stamp": 1560100348116.0,
        "user_id": "PWATjhtWwnihy597A"
      },
      "name": "Asus",
      "selected_display": "sZq2EoN7hcrnqyyrc"
    });

    Devices.insert({
      "device_id": "4fe84085-6488-4b08-941d",
      "user_id": "bxxpwy2cwGNumjWTK",
      "authorization_code": "HlLH4OHd4tH1QMLn2JtHzdbEOSlzi",
      "update_stamp": 1560100348116.0,
      "operating_system": "android",
      "device_type": "screen_display",
      "auth": {
        "access_token": "GMNHgFGrUt8AuvkQCqSu4DLlgk",
        "refresh_token": "pW-IpP1vCFQvuG8GYfARTLxI03",
        "stamp": 1560100348116.0,
      },
      "name": "Asus",
      "selected_display": "sZq2EoN7hcrnqyyrc"
    });
  }
});


//TEST OLD
/* "device_id" : "4fe84085-6488-4b08-941d-4286dfadd075",
    "user_id" : "bxxpwy2cwGNumjWTK",
    "authorization_code" : "HlLH4OHd4tH1QMLn2JtHzdbEOSlziVZX8a9BZFkF941",
    "update_stamp" : 1560100348116.0,
    "operating_system" : "android",
    "device_type" : "screen_display",
    "auth" : {
        "access_token" : "GMNHgFGrUt8AuvkQCqSu4DLlgkPgYH9C0tjB1n5B5AO",
        "refresh_token" : "pW-IpP1vCFQvuG8GYfARTLxI03COg6penRJHjfshmpx",
        "stamp" : 1560100348116.0,
        "user_id" : "PWATjhtWwnihy597A"
    },
    "name" : "Asus test device",
    "selected_display" : "sZq2EoN7hcrnqyyrc",
    "description" : "This is a test device for development purpose",
    "views" : {
        "video" : {
            "files" : [ 
                "wzWmuGAfMBDwiGqGL"
            ]
        },
        "image" : {
            "files" : [ 
                "D2zrYaqm7tC3pStFP", 
                "2Pv2JCs939HCZzKKe"
            ]
        }
    },
    "published_view" : "image",
    "startup_stamp" : NumberLong(1587979068489),
    "ping_stamp" : NumberLong(1587979068489) */