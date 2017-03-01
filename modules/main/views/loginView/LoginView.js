/**
 * Login view
 */
define(['backbone',
        'config',
        'text!./loginView.tmpl',
        'style!./css/style.css'
    ],
    function(Backbone,config,
        template) {
        var LoginView = Backbone.View.extend({
            // Html element to which to anchor the view
            el: $('body'),

            // View template
            template: _.template(template),

            // Events to which the view should react
            events : {
              "submit .login-view .login-block form" : "login"
            },
            router : null,
            /*
             * Initialize
             * Function called when creating the view, all associated information must be loaded
              *in view within this block so it does not affect the rendering of the view
             */
            initialize: function(options) {
              // Link view context to login function
              _.bindAll(this, "login", "procesarLogin", "hide");

              this.router = options.router;
            },

            /*
             * Render
             * Function to render the view
             */
            render: function(options) {
                // Build template
                var html = this.template({});

                // Append template
                this.$el.append(html);
            },
            login : function(){
              var _this = this;

              // 1. Get login and password
              var credentials = {
                login : this.$el.find("input#name").val(),
                password : this.$el.find("input#password").val()
              };

              // 2. The users of the service are obtained
              $.getJSON(config.baseURL+"/users", function(users){
                // Check if there are any users that match the credentials
                var foundedUser = _.filter(users, function(user){
                  return (user.login == credentials.login) && (user.password == credentials.password);
                });

                foundedUser = foundedUser.length > 0 ? foundedUser[0] : null;

                _this.procesarLogin(foundedUser);
              });

              return false;
            },
            procesarLogin : function(user){
              if(user){
                // Login right, display home screen with user information
                this.router.navigate(("home/"+btoa(JSON.stringify(user))), {trigger : true});
              }else{
                // Error logging in, user not found
                this.$el.find(".login-view form input#name").focus();
                this.$el.find(".login-view form input#name").addClass("input-error");

                var _this = this;
                setTimeout(function(){
                  _this.$el.find(".login-view form input#name").removeClass("input-error");
                }, 1000);
              }
            },
            hide : function(){
              this.$el.find(".login-view").addClass("logged");
            },
            destroy : function(){
              this.undelegateEvents();
              this.$el.find(".login-view").remove();
            }
        });
        return LoginView;
    });
