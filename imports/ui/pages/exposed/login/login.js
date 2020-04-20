import './login.html';

Template.Login.events({
    'click #login-action': function(event, template) {
        event.preventDefault();
        $('#login-error').html(""); 
        
        var email = template.find("#login-email").value;
        var pass = template.find("#login-pwd").value; 
    
        if(email && pass){
          Meteor.loginWithPassword(email.toLowerCase(), pass, function(err) {
            if (err) {  
              $('#login-error').html("Denied! Please make sure the details are correct."); 
              return;
            }
            else{
              // if we are on the login route, we want to redirect the user
              //return Router.go('user.dashboard');
              FlowRouter.go("/dashboard");
            }
          });
        }else{
          console.log("empty");
          return false;
        }
    
      }
})
