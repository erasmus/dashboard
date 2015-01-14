// DGB 2015-01-12 03:39 This setup should be at lib/config.coffee, but there is
// no environment control there. Left here for now.
// DGB 2015-01-13 05:57 Deprecated as LVO wants to use MAIL_URL env variable. 
// EXAMPLE: process.env.MAIL_URL = 'smtp://USER:PASSWORD@SMTPSERVER:587';

Accounts.emailTemplates.siteName = "Coyno";
Accounts.emailTemplates.from = "Coyno <noreply@coyno.de>";

// DGB 2015-01-12 03:40
// This email is sent when a new user registers. If we want to validate EMAILS
// addresses this is the place where to inform the user where to go next to
// validate the email.
Accounts.emailTemplates.verifyEmail = {
  subject: function (user) {
    return "Coyno Verification Email"; 
  },
  text: function (user, url) {
    var t = null;
    t= "Hello! \n\n Welcome to Coyno! \n\n";
    t+="";
    return t;
  }
};

// DGB 2015-01-12 03:41
// This email is send when the user request to change the password.
Accounts.emailTemplates.resetPassword ={
  subject: function (user) {
    return "Coyno Reset Password Email"; 
  },
  text: function (user,url) {
    var t = null;
    t= "Hello " + "! \n\n";  
    t+="You have succesfully changed your email";
    return t;
  }
};

// DGB 2015-01-12 03:43
// This is NOT a standard Meteor.Accounts email template
Accounts.emailTemplates.deleteAccount = {
  subject: function (user) {
    return "Coyno Delete User Email"; 
  },
  text: function (user) {
    var t = null;
    t= "Goodbye! \n\n It was great to have you around at Coyno! \n\n";
    t+="";
    return t;
  }
};