(function() {
  'use strict';

  angular
    .module('jsonSchemaVisualizer')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
