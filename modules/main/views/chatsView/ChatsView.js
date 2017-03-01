/**
 * Chat View
 */
define(['common/CommonBackboneView',
        //'main/models/UserModel',
        'main/collections/UserCollection',
        'main/collections/ChatCollection',
        'main/models/ChatModel',
        'config',
        'text!./chatsView.tmpl',
        'text!./chatItemView.tmpl',
        'style!./css/style.css'
    ],
    function(CommonBackboneView, /*UserModel,*/ UserCollection, ChatCollection, ChatModel,config,
        template, itemTemplate) {
        var ChatsView = CommonBackboneView.extend({
            // Html element to which to anchor the view
            el: $('body'),

            // Plantilla de la vista
            template: _.template(template),

            // View template
            itemTemplate: _.template(itemTemplate),

            // View events
            events: {
                "submit .chats-view .chats-send": "sendChat"
            },
            // Collection with all the chats shown in the view
            chats: null,

            // Milliseconds between each synchronization
            pollFrecuency: config.pollFrecuency,
            /*
             * Initialize
             * Function that is called when creating the view, must be loaded all the associated information
             * in view within this block so it does not affect the rendering of the view
             */
            initialize: function(options) {
                console.log("Chat view initialize");
                _.bindAll(this, "scrollBottom", "sendChat", "update", "updateBell");
                var _this = this;
                // Obtain user information
                /* var userInfo = new UserModel({
                  id : parseInt(localStorage.getItem("backbone-chat:userdata:id"))
                });
                userInfo.fetch({
                  async : false
                }); */

                /* Get users to display the name of the user in each chat element
                 * the user list is retrieved only once when the view is started
                 */
                this.users = new UserCollection();
                this.users.fetch({
                    success: function() {
                        // Get my user
                        _this.myUser = _this.users.get(parseInt(localStorage.getItem("backbone-chat:userdata:id")));

                        // Get chats
                        _this.update();

                        /* Initialize the chats check loop
                         * the ideal way to retrieve and maintain the list of chats
                         * synchronized would be using web sockets, but for the
                         * example is created a timer that poll every x seconds and
                         * updates the information associated with the view
                         * keep it synchronized.
                         */
                        setInterval(function() {
                            _this.update();
                        }, _this.pollFrecuency);

                        /*_this.chats = new ChatCollection();
                        _this.chats.fetch({
                          success : function(){
                            _this.render({});
                          }
                        }); */
                    }
                });

                // Chat iteration modification listener
                this.chatsIncrement = new ChatCollection();
                this.chatsIncrement.on("add", function() {
                    _this.updateBell();
                });
            },

            /*
             * Render
             * Function to render the view
             */
            render: function(options) {
                console.log("Chat view render");
                // Build template
                var html = this.buildTemplate(this.template, {
                    chats: this.chats,
                    myUser: this.myUser,
                    users: this.users,
                    itemTemplate: this.itemTemplate
                });

                // append template
                this.$el.append(html);

                // scroll bottom
                var _this = this;
                setTimeout(function() {
                    _this.scrollBottom();
                }, 500);

            },
            sendChat: function() {
                var _this = this;
                var msgInput = this.$el.find(".chats-view .chats-send input");
                var msg = msgInput.val();

                /* var newChat = new ChatModel();
                newChat.set("owner", this.myUser.get("id"));
                newChat.set("msg", msg);
                */
                var newChat = new ChatModel({
                    owner: this.myUser.get("id"),
                    msg: msg
                });

                newChat.save({}, {
                    success: function() {
                        _this.update();

                        msgInput.val("");
                    }
                });

                return false;
            },
            /* Update
             * Function to update the contents of the chat view
             * incrementally every t seconds or completely at startup
             *
             */
            update: function() {
                var _this = this;
                if (this.chats) {
                    // Obtain the corresponding increment (incremental request)
                    console.log("Incremental request");
                    var lastItemID = 0;
                    if(this.chats.length != 0){
                      var lastItemID = this.chats.at(this.chats.length - 1).get("id");
                    }

                    this.chatsIncrement.reset();
                    this.chatsIncrement.fetch({
                        data: {
                            start: lastItemID
                        },
                        success: function() {
                            // Add the increment to the existing chat list
                            _this.chats.add(_this.chatsIncrement.toJSON());

                            // Render the new elements
                            _.each(_this.chatsIncrement.models, function(chat) {
                                _this.$el.find(".chats-view .chats-list .chats-list-wrapper").append(
                                    _this.buildTemplate(_this.itemTemplate, {
                                        myUser: _this.myUser,
                                        chat: chat,
                                        users: _this.users
                                    })
                                );
                            });

                            if (_this.chatsIncrement.length != 0) {
                                console.log("Hay " + _this.chatsIncrement.length + " nuevos chats");
                                _this.scrollBottom();
                            }
                        }
                    });
                } else {
                    // Get everything (Initial petition)
                    console.log("Peticion inicial");
                    if (this.chats != null) {
                        return false;
                    }
                    this.chats = new ChatCollection();
                    this.chats.fetch({
                        success: function() {
                            _this.render({});
                        }
                    });
                }
            },
            /*
             * Function that updates the top bell with the number of new chats
             */
            updateBell: function() {
                var _this = this;
                // Update the value of the bell bubble and display it
                /*
                 * This way it would recover the count of chats of the own user
                 * in case you want to make a more complex filtering, it is necessary to delegate in
                 * underscore functions
                 */
                //var bellCount = this.chatsIncrement.where({owner : this.myUser.get("id")}).length;

                var bellCount = _.filter(this.chatsIncrement.models, function(chatIncrement) {
                    return chatIncrement.get("owner") != _this.myUser.get("id");
                }).length;

                if (bellCount > 0) {
                    var notificationsBubble = this.$el.find(".chats-view .chats-topbar .notifications .bubble");
                    notificationsBubble.fadeIn();
                    notificationsBubble.text(bellCount);

                    setTimeout(function() {
                        notificationsBubble.fadeOut();
                    }, 1500);
                }
            },
            /*
             * Scroll bottom
             * Calculate the remaining scroll to always see the last elements of the block
             * and perform an animation with jQuery to do the scroll at the end of the block
             */
            scrollBottom: function() {
                var wrapper = this.$el.find(".chats-view .chats-list .chats-list-wrapper");

                // Option 1 : Iterate over all elements and retrieve their sizes
                var wrapperSize = 0;
                var _this = this;
                _.each(wrapper.children(), function(child){
                  wrapperSize += parseInt(_this.$el.find(child).css("margin-top")) + _this.$el.find(child).height();
                });

                // Option 2 : Get the size and margin of the first element and multiply by number of children, so if they have different sizes will not do well the scroll
                //var wrapperSize = (wrapper.children().height() + parseInt(wrapper.children().css("margin-top"))) * wrapper.children().length;
                //wrapper.scrollTop(wrapperSize - wrapper.height());

                // TODO Option 3 : Create a panel for all children and get their height directly

                wrapper.animate({
                    scrollTop: wrapperSize - wrapper.height()
                }, 250, function() {
                    // Animation complete.
                });
            },
            destroy: function() {
                // Not implemented
            }
        });
        return ChatsView;
    });
