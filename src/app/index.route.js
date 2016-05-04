(function() {
  'use strict';

  angular
    .module('jsonSchemaVisualizer')
    .config(function ($componentLoaderProvider) {
      $componentLoaderProvider.setTemplateMapping(function(name) {
        return 'app/' + name + '/' + name + '.html';
      });
    })
    .controller('RouterController', function ($router) {
      $router.config([
        { path: '/', component: 'main' }
      ]);
    });

})();
