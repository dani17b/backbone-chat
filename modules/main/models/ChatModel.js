define(['backbone', 'config'], function(Backbone, config) {
    var ChatModel = Backbone.Model.extend({
        urlRoot: config.baseURL + "/chats"
    });

    return ChatModel;
});
