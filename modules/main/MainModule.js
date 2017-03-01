define([
  "backbone",
  "./views/loginView/LoginView",
  "./views/homeView/HomeView",
  "./views/chatsView/ChatsView"
], function(Backbone,LoginView,HomeView, ChatsView){
  var MainModule = Backbone.Router.extend({
  	routes:{
  		"" : "login",
      "home/:user" : "home",
      "home" : "chats"
  	},
    selectedView : null,
  	login: function() {
  		// Create login view
  		this.selectedView = new LoginView({
        router : this
      });
      this.selectedView.render({});
  	},
    home : function(user){
      var user = JSON.parse(atob(user));

      // Create home view
      var homeView = new HomeView({
        user : user,
        router : this
      });

      // Hide login view
      this.selectedView.hide();

      // Show home view
      homeView.render({});

      // Remove login view
      var _this = this;
      setTimeout(function(){
        _this.selectedView.destroy();
        _this.selectedView = homeView;
      }, 1000);
    },
    chats : function(){
      this.selectedView = new ChatsView({});
    }
  });

  return MainModule;
});
