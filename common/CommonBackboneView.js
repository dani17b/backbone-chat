/**
 * Vista comun a todas las vistas de la aplicacion
 */
define(['backbone',
        'util/DateUtils',
    ],
    function(Backbone, DateUtils) {
        var CommonBackboneView = Backbone.View.extend({
          buildTemplate : function(template, customOptions){
            var commonOptions = {
              DateUtils : DateUtils
            };
            var options = $.extend({}, customOptions, commonOptions);
            return template(options);
          }
        });
        return CommonBackboneView;
    });
