require.config({
  baseUrl: '/',
  waitSeconds: 0,
  paths: {
    // App modules
    main : 'modules/main',
    config : 'conf/config',
    util : 'util',
    common : 'common',

    //Vendor libs
    backbone: '../node_modules/backbone/backbone',
    jquery: '../node_modules/jquery/dist/jquery.min',
    underscore: '../node_modules/underscore/underscore',
    text: '../node_modules/requirejs-text/text',
    style : '../node_modules/require-css/css'
  },
  shim: {
    // shim (solamente para modulos no AMD)
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

define([
  'backbone',
  'main/MainModule'
],
function(Backbone, MainModule) {
  // Create router
  var router = new MainModule();

  // Start app
  Backbone.history.start();
});
