Template.registerHelper("parseDate", function (d) { return parseDate(d); });
parseDate = function (d) {
    d = new Date(d);
    return ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}

Template.registerHelper("runtimeFromDate", function (d) { return runtimeFromDate(d); });
runtimeFromDate = function (oldDate) {
    date_future = new Date(oldDate);
    date_now = new Date();

    seconds = Math.floor((date_future - (date_now)) / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    //$("#time").text("Time until new year:\nDays: " + days + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);

    return "Time until new year:\nDays: " + days + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds;
}

/*
	Date/Time manipulation, mostly for display purposes.
	Functions are also
*/


Date.prototype.addDays = function (days) {
    var result = new Date(this.valueOf());
    result.setDate(result.getDate() + days);
    return result;
}

getDaysFromSeconds = function (seconds) {

    return Math.floor(seconds / (3600 * 24));
}

getDiffSeconds = function (time1, time2) {
    var difference = time1 - time2;
    var secDifference = Math.floor(difference / 1000); //difference/1000/60/60/24);

    return secDifference;
}

getDateFromEpoch = function (epochTime) {
    var readableTime = new Date(epochTime * 1000);
    return readableTime;
};

getTimeDifference = function (startDate, endDate, units) {
    if (units)
        var dif = moment(endDate).diff(startDate, units);
    else
        var dif = moment(endDate).diff(startDate);

    return dif;
}

//Returns a dd/mm/yy date format
getStringFromDate = function (date, excludeDate) {

    if (typeof (date) !== 'undefined') {
        if (date.length > 0) {
            //When we passing a document i.e. daySummary/userHourLog array
            var date = moment(date[0].updatedOn).local();
        }
        else {
            var date = moment(date).local();
        }

        switch (excludeDate) {
            case true:
                return date.format('HH') + ":" + date.format('mm') + ":" + date.format('ss') + ":" + date.format('SSSSS');
                break;

            default:
            case false:
                return date.format('DD') + "/" + date.format('MM') + "/" + date.format('YY') + " " + date.format('HH') + "h" + date.format('mm') + "m";
                break;

            case 'hoursOnly':
                return date.format('HH') + ":" + date.format('mm');
                brek;


            case 'dateOnly':
                return date.format('DD') + "/" + date.format('MM') + "/" + date.format('YY');
                break;

            case 'weekDay':
                return date.format('ddd') + ' ' + date.format('DD') + "/" + date.format('MM') + "/" + date.format('YY');
                break;
        }
    }
    else {
        return 'Time of update unknown.'
    }

};

getStringFromEpoch = function (epochTime, hoursOnly) {
    var readableTime = getDateFromEpoch(epochTime);
    var days = Math.floor(readableTime / 8.64e7);
    var hours = (days * 24) + readableTime.getUTCHours();

    if (hoursOnly) {
        if (days > 0 || readableTime.getUTCHours() !== 0) {
            if (hours >= 100) {
                var stringTime = hours + "h";
            }
            else {
                var stringTime = hours + "h " + readableTime.getMinutes() + "m";
            }
        }
        else {
            var stringTime = readableTime.getMinutes() + "m " + readableTime.getSeconds() + "s";
        }
    }
    else {
        if (days > 0) {
            var stringTime = hours + "h";
        }
        else if (readableTime.getUTCHours() !== 0) {
            var stringTime = hours + "h " + readableTime.getMinutes() + "m";
        }
        else {
            var stringTime = readableTime.getMinutes() + "m " + readableTime.getSeconds() + "s";
        }
    }

    return String(stringTime);

};

formatDate = function (dateObj, format) {
    return moment(dateObj).format(format);
}

timeToDate = function (date, suffix) {
    if (suffix) {
        suffix = true;
    }
    else {
        suffix = false;
    }

    return moment().to(date, suffix);
}

timeFromDate = function (date, suffix) {
    if (suffix) {
        suffix = true;
    }
    else {
        suffix = false;
    }
    return moment().from(date, suffix);
}

//Converts a "smart" input (ex. 2d 5h) to value in hours
parseStringToHours = function (input) {
    var totalHours = 0;
    var formatError = false;
    //Organization settings
    var organization = OrganizationProfile.findOne({ organization: Meteor.user().profile.organization });
    var workableHours = organization.workableDailyHours;
    var workableWeekDays = organization.workableWeekDays.length;
    var workableMonthDays = organization.workableMonthDays;
    //Regexes
    var hasMultipleMonths = input.match(/(\d+)(?=[M])/g);
    var hasMultipleWeeks = input.match(/(\d+)(?=[wW])/g);
    var hasMultipleDays = input.match(/(\d+)(?=[dD])/g);
    var hasMultipleHours = input.match(/(\d+)(?=[hH])/g);
    var hasMultipleMinutes = input.match(/(\d+)(?=[m])/g);

    if (typeof input === 'string' && input.length > 0) {

        //Check if input is numbers only
        if (input.match(/[a-z, A-Z]/g) === null) {
            totalHours = parseInt(input);
        }
        //Parse smart string to hours
        else {
            if (typeof workableHours === 'undefined' || workableHours === 0) { workableHours = 8; }
            if (typeof workableWeekDays === 'undefined' || workableWeekDays === 0) { workableWeekDays = 5; }
            if (typeof workableMonthDays === 'undefined' || workableMonthDays === 0) { workableMonthDays = 21; }

            //Months validation
            if (hasMultipleMonths !== null) {
                if (hasMultipleMonths.length === 1) {
                    totalHours += parseInt(hasMultipleMonths[0]) * workableMonthDays * workableHours;
                }
                else { formatError = true; }
            }

            //Weeks validation
            if (hasMultipleWeeks !== null) {
                if (hasMultipleWeeks.length === 1) {
                    //console.log('has weeks! ' + hasMultipleWeeks[0] +', '+ workableWeekDays +', '+ workableHours)
                    totalHours += parseInt(hasMultipleWeeks[0]) * workableWeekDays * workableHours;
                    //console.log(totalHours)
                }
                else { formatError = true; }
            }

            //Days validation
            if (hasMultipleDays !== null) {
                if (hasMultipleDays.length === 1) {
                    totalHours += parseInt(hasMultipleDays[0]) * workableHours;
                }
                else { formatError = true; }
            }

            //Hours validation
            if (hasMultipleHours !== null) {
                if (hasMultipleHours.length === 1) {
                    totalHours += parseInt(hasMultipleHours[0]);
                }
                else { formatError = true; }
            }

            //Minutes validation
            if (hasMultipleMinutes !== null) {
                if (hasMultipleMinutes.length === 1) {
                    var minutesToHours = parseInt(hasMultipleMinutes[0]) / 60;
                    totalHours += minutesToHours;
                }
                else { formatError = true; }
            }
        }
    }

    if (formatError) {
        toastr.error('Planned time formatting error.<br>Please provide a valid number or use smart string syntax such as:<br><ul><li>1M (month)</li><li>1w (week)</li><li>1d (day)</li><li>1h (hour)</li><li>1m (mminutes)</li>');
    }
    else if (input.length === 0) {
        toastr.error('Planned time cannot be empty, minimum 0 hours');
    }
    else {
        return parseFloat(totalHours);
    }

};
//Converts hours into a smart string (i.e. 5d 6h)
parseHoursToString = function (hours) {

    if (typeof hours !== 'number') {
        return 'N/A';
    }

    if (hours === 0) {
        return '0h';
    }

    var organization = OrganizationProfile.findOne()
    var workableHours = organization.workableDailyHours;
    var workableWeekDays = organization.workableWeekDays.length;
    var workableMonthDays = organization.workableMonthDays;

    var smartString = '';

    var months = 0;
    var weeks = 0;

    var days = hours / workableHours;

    var remainingDays = 0;
    var remainingHours = 0;
    var remainingMinutes = 0;

    if (days >= workableMonthDays) {
        //console.log('Got Month')
        months = days / workableMonthDays;

        remainingDays = months % 1;
        months = months - remainingDays;

        smartString += months + 'M '

        if (remainingDays > 0) {
            days = Math.round(remainingDays * workableMonthDays);
        }
    }

    if (days >= workableWeekDays && days < workableMonthDays) {
        weeks = days / workableWeekDays;
        remainingDays = weeks % 1;

        weeks = weeks - remainingDays;

        smartString += weeks + 'w ';

        if (remainingDays > 0) {
            days = Math.round(remainingDays * workableWeekDays);
        }
        //console.log('Got weeks ' + weeks)

    }

    if (days < workableWeekDays && days >= 1) {
        //console.log('Got days')

        days = days * workableHours / workableHours;


        remainingHours = days % 1;

        days = days - remainingHours;

        smartString += days + 'd ';


        if (remainingHours > 0) {
            remainingHours = remainingHours * workableHours;
        }
    }
    //If days value is < 1, multiply by working hours to convert days in hours
    else {
        remainingHours = days * workableHours;
    }

    //Check for hours and remaining minutes
    if (remainingHours < 8 && remainingHours > 0) {
        //console.log('Got hours')
        remainingMinutes = remainingHours % 1;

        remainingHours = remainingHours - remainingMinutes;


        smartString += remainingHours + 'h ';

        if (remainingMinutes > 0) {
            smartString += Math.round(remainingMinutes * 60) + 'm ';
        }

    }

    return smartString;
};

estimatedNewEndDate = function (hours, obj) {
    //Estimate total amount of days to add to start date
    //console.log('-- estimatedNewEndDate --')

    var organizationProfile = OrganizationProfile.findOne({ organization: Meteor.user().profile.organization });

    var start = obj.startDate;
    var days = Math.floor(hours / organizationProfile.workableDailyHours);

    //console.log('for '+ hours +' hours got ' + days + ' days');

    var breakHours = days * organizationProfile.breakHours;

    var i = 0;
    var newEndDate = start.clone();

    while (i < hours) {

        newEndDate = newEndDate.add(1, 'hours');

        var tmrow = newEndDate.clone().hour(organizationProfile.workStartHour).minutes(0).seconds(0).milliseconds(0);
        var endOfDay = newEndDate.clone().endOf('day');

        if (newEndDate.hour() > organizationProfile.workEndHour || (newEndDate.isAfter(endOfDay) && newEndDate.isBefore(tmrow))) {
            //console.log('jump to next day');
            newEndDate = newEndDate.add(1, 'days').hour(organizationProfile.workStartHour + 1);
        }

        if (newEndDate.isoWeekday() === 6 || newEndDate.isoWeekday() === 7) {
            //console.log('jump to next business day');
            newEndDate = newEndDate.add(24, 'hours');
        }

        i += 1;
    }

    newEndDate = newEndDate.add(breakHours, 'hours');
    if (newEndDate.hour() > organizationProfile.workEndHour || (newEndDate.isAfter(endOfDay) && newEndDate.isBefore(tmrow))) {
        //console.log('jump to next day');
        newEndDate = newEndDate.add(1, 'days').hour(organizationProfile.workStartHour);
    }

    if (newEndDate.isoWeekday() === 6 || newEndDate.isoWeekday() === 7) {
        //console.log('jump to next business day');
        newEndDate = newEndDate.add(24, 'hours');
        while (newEndDate.isoWeekday() === 6 || newEndDate.isoWeekday() === 7) {
            newEndDate = newEndDate.add(24, 'hours');
        }
    }

    //console.log('incremented ' + i + ' hours and ' + breakHours + ' break hours')
    //console.log('newEndDate-> ' + newEndDate.format('DD/MM/YYYY HH:mm a'));

    return {
        'newEndDate': newEndDate
    }

}

estimateWorkableHours = function (startDate, endDate) {
    //console.log('-- estimateWorkableHours --')
    var organizationProfile = OrganizationProfile.findOne({ organization: Meteor.user().profile.organization });


    var totalHoursDif = endDate.diff(startDate, 'hours');
    var totalDaysDif = endDate.diff(startDate, 'days');

    var start = startDate.clone();
    var totalWorkableHours = 0;

    //var totalDaysDif = Math.round(totalHoursDif / 24);

    //Check if can contain weekends
    if (totalDaysDif >= 7) {
        var w = Math.round(totalDaysDif / 7);
        totalDaysDif = totalDaysDif - (w * 2);
    }
    else if (totalDaysDif === 6) {
        totalDaysDif -= 1;
    }

    //console.log('for '+ totalHoursDif +' hours got ' + totalDaysDif + ' days');

    var breakHours = totalDaysDif * organizationProfile.breakHours;
    //console.log('breakHours ->' + breakHours)

    //console.log('totalHoursDif-> ' + totalHoursDif);

    while (start.isBefore(endDate, 'hour')) {
        if (start.hour() >= organizationProfile.workStartHour && start.hour() < organizationProfile.workEndHour) {
            if (start.isoWeekday() !== 6 && start.isoWeekday() !== 7) {
                totalWorkableHours += 1;
            }
        }
        start = start.add(1, 'hours');
    }

    totalWorkableHours -= breakHours;

    //console.log('totalWorkableHours: ' + totalWorkableHours)

    return totalWorkableHours;



}

getWeekDays = function (startDate, endDate) {
    if (startDate._isAMomentObject && endDate._isAMomentObject) {
        var start = moment(startDate); // use a clone
        var end = moment(endDate);
        var weekDays = 0;

        var organizationProfile = OrganizationProfile.findOne({ organization: Meteor.user().profile.organization });

        while (start.isBefore(end) === true) {
            if (organizationProfile.workableWeekDays.indexOf(start.isoWeekday()) >= 0) {
                weekDays += 1;
            }
            start = start.add(1, 'days');
        }
        return weekDays;
    }
}