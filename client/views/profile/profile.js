Template.userProfile.created = function() {
  this.editingSection = new ReactiveVar('','');
  this.userMessage = new ReactiveVar(false,'');

  // DGB 2015-01-20 03:58 This variable has an unfortunatene name, pleas notice
  // this section and the section from editingSection relate to different
  // things.
  this.openedSection = new ReactiveVar('','');
};

Template.userProfile.helpers({
  displayUsername: function () {
    return Meteor.user().profile.username;
  },
  userEmail: function () {
    if (Meteor.user() && Meteor.user().emails) {
      return Meteor.user().emails[0].address;
    }
  },
  getOpenedSection: function (section) {
    var openedSection = Template.instance().openedSection.get();
    return (openedSection===section);
  },
  // DGB 2015-01-12 04:42
  // This functions controls the inline edit of forms
  getEditingSection: function (section) {
    var editingSection = Template.instance().editingSection.get();
    return (editingSection===section);
  },
  getUserMessage: function(section) {
    return Template.instance().userMessage.get()[section];
  },
});

Template.userProfile.events({
  // DGB 2015-01-21 04:25 Deprecated
  // 'click #btnPasswordManagement': function (event, template) {
  //   if (template.openedSection.get()==='passwordManagement') template.openedSection.set('');
  //   else template.openedSection.set('passwordManagement');
  //   return true;
	// },
  // 'click #btnAccountManagement': function (event, template) {
  //   if (template.openedSection.get()==='accountManagement') template.openedSection.set('');
  //   else template.openedSection.set('accountManagement');
  //   return true;
	// },
  "click #change_password": function (event, template) {
    event.preventDefault();
    template.editingSection.set('password');
    var oldPassword = template.$("#old_password").val();
    var newPassword = template.$("#new_password").val();
    var newPasswordAgain = template.$("#new_password_again").val();

    var invalidPassword = function(passwordString, passwordStringAgain, currentPassword) {
      var err = '';
      if (passwordString === currentPassword) {err+= 'New password is the same as the old password. '}
      if (passwordString !== passwordStringAgain) {err+= 'Passwords do not match. '}
      if (passwordString.length<7) {err+= 'Password is too short (need to be at least 6 characters long). '}
      if (passwordString.search(/[a-z]/i) < 0) {err+= 'Password needs to have at least a letter. '}
      if (passwordString.search(/[0-9]/) < 0) {err+= 'Password needs to have at least a digit. '}
      return (err==='')?false:err;
    }

    if(!invalidPassword(newPassword, newPasswordAgain, oldPassword)){
      Accounts.changePassword(oldPassword, newPassword, function (err) {
        if(err){
          template.userMessage.set({password: {class: 'error', message: err.reason}});
        }else{
          template.userMessage.set({password: {class: 'success', message:'The password was changed, and we have sent you an email'}})
          Meteor.call('sendEmail','resetPassword');
          template.$("#passwordChange").remove("");
        }
      });
    }
    else {
      template.userMessage.set({password: {class: 'error', message: invalidPassword(newPassword,newPasswordAgain,oldPassword)}})
    }
  },
  "click #confirm_delete_account": function () {
    Meteor.call('removeAccount');
  },
  'click .setEditingSectionUsername': function (event, template) {
    template.editingSection.set('username');
	},
  'click .setEditingSectionEmail': function (event, template) {
     template.editingSection.set('email');
	},
  'submit [name="saveEmail"]': function (event, template) {
      event.preventDefault();
      event.stopPropagation();
      var email = $("#newEmail").val();
      template.editingSection.set('email');
      Meteor.call('changeUserEmail',email, function(err,result) {
      if (err) {
          template.userMessage.set({email: {class: 'error', message: err.reason}});
      }
      else {
        if (!result) {
          template.$("#newEmail").val();
          template.userMessage.set({username: {class: 'error', message: '"' + email + '" is not a valid Email, please select another username'}});
        }
        else {
          template.editingSection.set('');
          template.userMessage.set(false);
        }
      }
    });
	},
  'submit [name="saveUsername"]': function (event, template) {
    event.preventDefault();
    event.stopPropagation();
    var username = $("#newUsername").val();
    // DGB 2015-01-15 07:05 If the user wants to save again the current username
    // we ignore the event
    if (username === Meteor.user().profile.username) {
      template.editingSection.set('');
      return;
    }
    template.editingSection.set('username');
    // DGB 2015-01-15 05:48 If the username is new, we check if the username is
    // unique. This can only be done on the server
    // because the client doesn't have the whole user database
    Meteor.call('verifyUsernameIsUnique',username, function(err,result) {
      if (err) {
          template.userMessage.set({username: {class: 'error', message: err.reason}});
      }
      else {
        if (!result) {
          template.$("#newUsername").val();
          template.userMessage.set({username: {class: 'error', message: '"' + username + '" is already in use, please select another username'}});
        }
        else {
          // DGB 2015-01-15 07:42 Username is unique. For extra confidence that the username is unique, it should not be editable on the profile
          Meteor.users.update(
            {_id: Meteor.userId()},
            {$set: {'profile.username':username}},
            false,
            function(err,result) {
              template.editingSection.set('');
              template.userMessage.set(false);
          });
        }
      }
    });
	}
});


