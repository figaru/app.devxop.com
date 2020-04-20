var console=(function(oldCons){
    return {
        log: function(text){
            if(Meteor.isDevelopment){
                oldCons.log(text);
            }else{
                
            }
            
            // Your code
        },
        info: function (text) {
            oldCons.info(text);
            // Your code
        },
        warn: function (text) {
            oldCons.warn(text);
            // Your code
        },
        error: function (text) {
            oldCons.error(text);
            // Your code
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;