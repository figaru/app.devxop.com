Template.registerHelper("isDeviceOnline", function(device){
    if (device && device["ping_stamp"]) {
        let time1 = device.ping_stamp;
        let time2 = new Date().getTime();
        let res;

        let diff = getDiffSeconds(time2, time1);

        if (diff > 60) { //ping stamp update every 30 seconds
            return false
        } else {
            return true
        }

    } else {
        return false;
    }
});