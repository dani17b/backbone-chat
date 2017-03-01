define(['backbone', 'config', 'main/models/UserModel'], function(Backbone, config, UserModel) {
    var UserCollection = Backbone.Collection.extend({
        url: config.baseURL + "/users",
        model : UserModel
    });

    return UserCollection;
});
