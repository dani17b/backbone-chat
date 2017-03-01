/**
 * Initial View
 */
define(['backbone',
        'text!./homeView.tmpl',
        'util/DateUtils',
        'style!./css/style.css'
    ],
    function(Backbone,
        template, DateUtils) {
        var HomeView = Backbone.View.extend({
            // Html element to which to anchor the view
            el: $('body'),

            // View template
            template: _.template(template),

            /*
             * Initialize
             * Function that is called when creating the view, must be loaded all the associated information
             * in view within this block so it does not affect the rendering of the view
             */
            initialize: function(options) {
                this.user = options.user;

                // Save user id to local storage
                localStorage.setItem("backbone-chat:userdata:id", this.user.id);

                this.router = options.router;
            },

            /*
             * Render
             * Function to render the view
             */
            render: function(options) {
                var _this = this;

                // Build template
                var html = this.template({
                    name: this.user.name,
                    registerDate: DateUtils.dateToStr(new Date(this.user.registerDate))
                });

                // Append template
                this.$el.append(html);

                // Show view
                this.$el.find(".home-view").fadeIn();

                setTimeout(function() {
                    _this.destroy();
                    _this.router.navigate("home", {
                        trigger: true
                    });
                }, 3000);
            },
            destroy: function() {
                var _this = this;
                this.$el.find(".home-view").fadeOut(function() {
                    // It would not be necessary because there are no events associated with this view
                    _this.undelegateEvents();
                    _this.$el.find(".home-view").remove();
                })
            }
        });
        return HomeView;
    });
