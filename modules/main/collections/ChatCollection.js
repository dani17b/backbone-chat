define(['backbone', 'config', 'main/models/ChatModel'], function(Backbone, config, ChatModel) {
    var ChatCollection = Backbone.Collection.extend({
        url: config.baseURL + "/chats",
        model : ChatModel
    });

    return ChatCollection;
});
