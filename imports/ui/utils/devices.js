Template.registerHelper("deviceStatus", function(device){
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
        res = "unknown";

        return res;
    }
});