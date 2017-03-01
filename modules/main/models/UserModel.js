define(['backbone', 'config'], function(Backbone, config) {
    var UserModel = Backbone.Model.extend({
        urlRoot: config.baseURL + "/users"
    });

    return UserModel;
});
