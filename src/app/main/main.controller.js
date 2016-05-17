(function() {
  'use strict';

  angular
    .module('jsonSchemaVisualizer')
    .controller('MainController', MainController);


  /** @ngInject */
  function MainController($sce, vizJs, $http, $log, toastr, $location) {
    var vm = this;

    // use a weakmap to generate ids for all the schema parts
    var objIdMap=new WeakMap, objectCount = 0;
    function objectId(object){
      if (!objIdMap.has(object)) objIdMap.set(object,++objectCount);
      return objIdMap.get(object);
    }

    function extractNode(schema, parentId, name) {
      var retStr = '    ' + objectId(schema) + ' [label="' + name + '"];';

      if (schema.type == 'object') {
        retStr += '    ' + objectId(schema) + ' [shape=box];';
      }
      if (
          (schema.type == 'object' && !schema.properties) ||
          (schema.type == 'array' && schema.items.type == 'object' && !schema.properties)
      ) {
        retStr += '    ' + objectId(schema) + ' [style=filled, fillcolor=red];';
      }

      if (parentId != 0) {
        retStr += '    ' + parentId + ' -> ' + objectId(schema) + ';';
      }

      if (schema.properties) {
        for (var property in schema.properties) {
          if (schema.properties.hasOwnProperty(property)) {
            retStr += extractNode(schema.properties[property], objectId(schema), property);
          }
        }
      }
      if (schema.items) {
        for (var itemProp in schema.items.properties) {
          if (schema.items.properties.hasOwnProperty(itemProp)) {
            retStr += extractNode(schema.items.properties[itemProp], objectId(schema), itemProp);
          }
        }
      }
      return retStr;
    }

    vm.load = function() {
      vm.loading = true;
      if (!vm.url && $location.search().q) {
        $log.info("Using URL from search", $location.search());
        vm.url = $location.search().q;
      }
      if (!vm.url) {
        $log.error("No schema URL given");
        vm.loading = false;
        vm.error = true;
        return;
      }
      $http.get(vm.url).then(function(data) {
        $location.search('q', vm.url);
        try {
            vm.loading = false;
            var graph = 'digraph { ' + extractNode(data.data, 0, 'root') + '}';
            vm.svg = $sce.trustAsHtml(vizJs.render(graph));
            vm.error = false;
            toastr.success('Schema loaded');
        } catch (e) {
            toastr.error('Failed to generate graph from url');
        }
      }, function(err) {
        $location.search('q', vm.url);
        toastr.error('failed to load schema');
        $log.error(err);
        vm.loading = false;
        vm.error = true;
      });
    };

    vm.load();
  }
})();
