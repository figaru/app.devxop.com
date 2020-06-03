import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import './devices.collection.js';

import io from 'socket.io-client';

Meteor.methods({
    'devices.version.update': function (deviceId, vId) {
        console.log(vId);
        if (typeof vId === undefined || vId >= 2147483647) { //int32 max numbe
            //reset version
            Devices.update(deviceId, {
                $set: {
                    "v_id": 0
                }
            })
        } else {
            //increment
            Devices.update(deviceId, {
                $inc: {
                    "v_id": 1
                }
            });
        }


    },
    'devices.emit.update': function (deviceId) {

        const socket = io(Meteor.settings.public.api.storage);

        socket.on('connect', function () {

            socket.emit("device.emit.update", deviceId);
            socket.disconnect();
        });
    },
    'devices.emit.restart': function (deviceId) {

        const socket = io(Meteor.settings.public.api.storage);

        socket.on('connect', function () {

            socket.emit("device.emit.restart", deviceId);
            socket.disconnect();
        });
    },
    'devices.emit.upgrade': function (deviceId) {

        const socket = io(Meteor.settings.public.api.storage);

        socket.on('connect', function () {

            socket.emit("device.emit.upgrade", deviceId);
            socket.disconnect();
        });
    }
});
