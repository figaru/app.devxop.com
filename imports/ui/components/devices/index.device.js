import "./index.device.html";

Template.status_device.helpers({
    'getDeviceStatus': (device) => {
        if (device && device["ping_stamp"]) {
            let time1 = device.ping_stamp;
            let time2 = new Date().getTime();
            let res;

            let diff = getDiffSeconds(time2, time1);

            if (diff > 130) { //ping stamp update every 30 seconds
                res = "offline";

                return res;
            } else {
                res = "online";

                return res;
            }

        } else {
            res = "---";

            return res;
        }
    }
});

Template.runtime_device.helpers({
    'getDeviceRuntime': (device) => {
        if (device && device.startup_stamp && device.ping_stamp) {
            let time1 = device.ping_stamp;
            let time2 = new Date().getTime();

            let diff = getDiffSeconds(time2, time1);

            if (diff > 20) { //ping stamp update every 30 seconds
                return "---";
            } else {
                return runtimeFromDate(device.startup_stamp);
            }
        } else {
            return "---";
        }
    }
});