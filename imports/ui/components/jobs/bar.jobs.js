import './bar.jobs.html';

Template.bar_jobs.helpers({
    'hasJobs': function () {
        let jobs = Jobs.find().count();

        if (jobs > 0) {
            return true;
        }

        return false;
    },
    'hasRunningJob': function () {
        let jobs = Jobs.find({ start: true, end: false }).count();

        if (jobs > 0) {
            return true;
        }

        return false;
    },
    'listPending': function () {
        return Jobs.find({ start: false, end: false }, {sort: {end_stamp: -1}}).fetch();
    },
    'listRunning': function () {
        return Jobs.find({ start: true, end: false }, {sort: {end_stamp: -1}}).fetch();
    },
    'listFinished': function () {
        return Jobs.find({ start: true, end: true }, {sort: {end_stamp: -1}}).fetch();
    },
    'runningStats': function () {
        let jobs = Jobs.find({ start: true, end: false }).fetch();
        let data = {
            count: jobs.length,
            progress: 0
        }

        if (jobs.length > 0) {
            jobs.forEach((job) => {
                data.progress += job.progress | 0;
            });
            data.progress = data.progress / data.count;
        }

        return data;

    }
});

Template.bar_jobs.events({
    'click .js-toggle-jobs': function () {
        let toggled = Session.get(TOGGLE_JOBS);

        if (toggled == "jobs-toggled") {
            Session.set(TOGGLE_JOBS, "");
        } else {
            Session.set(TOGGLE_JOBS, "jobs-toggled");
        }

    },
    'click .js-clear-finished': function(){
        let jobsToRemove = Jobs.find({ start: true, end: true }).fetch();

        jobsToRemove.forEach((job)=>{
            Jobs.remove(job._id);
        });
    }
});