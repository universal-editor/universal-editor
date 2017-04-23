(function() {
  'use strict';
  angular
    .module('universal-editor')
    .controller('UeNodeController', UeNodeController);

  function UeNodeController($scope, ApiService, $timeout, $rootScope, $element) {
    /* jshint validthis: true */
    'ngInject';
    var vm = this;
    vm.$onInit = function() {
      vm.dragMode = vm.setting.component.settings.dragMode;
      vm.dataSource = vm.setting.component.settings.dataSource;
      vm.loaded = false;
      vm.treeSource = vm.dataSource.tree;
      vm.nodeId = getRandomId();

      if (vm.treeSource) {
        vm.childrenField = vm.treeSource.childrenField;
        vm.childrenCountField = vm.treeSource.childrenCountField;
        vm.selfField = vm.treeSource.selfField;
      }
      if (angular.isObject(vm.parentNode) && vm.parentNode[vm.childrenCountField] === 0) {
        vm.loaded = true;
      }

      $scope.$on('ue:nodeDataLoaded', componentLoadedHandler);
      function componentLoadedHandler(event, data) {
        if (vm.items && !vm.$stop) {
          var components = vm.tableFields.map(function(f) { return f.component; }),
            extendedData = [];
          angular.forEach(vm.items, function(item, index) {
            item.$options = item.$options || {
              $componentId: vm.options.$componentId,
              regim: 'preview',
              $dataIndex: index,
              isSendRequest: true
            };
            item.$isExpand = true;
            if (!angular.isArray(item[vm.childrenField]) && item[vm.childrenCountField] > 0) {
              item.$isExpand = false;
            }
            if (item[vm.childrenCountField] === 0) {
              item[vm.childrenField] = [];
            }

            if (vm.selfField) {
              var self = item[vm.selfField];
              self.$options = item.$options;
              extendedData.push(self);
            } else {
              extendedData.push(item);
            }
          });         

          $timeout(function() {
            vm.data = {
              editorEntityType: 'exist',
              $componentId: vm.options.$componentId,
              $items: extendedData,
              $nodeId: vm.nodeId
            };
            vm.$stop = true;
            $scope.$broadcast('nodeRowUpdate', vm.data);
            $scope.$broadcast('ue:nodeDataLoaded', vm.data);
            vm.$stop = false;
          });
          vm.loaded = true;
        }
      }

      vm.onUpdate = function(data) {

      };

      function getRandomId() {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
          function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16);
          }
        );
      }

      vm.expand = function(item) {
        item.$isExpand = !item.$isExpand;
        if (vm.dragMode && angular.isFunction(vm.dragMode.expandHandler) && vm.childrenField && !angular.isArray(item[vm.childrenField]) && !item.$sendRequest) {
          item.$sendRequest = true;
          vm.dragMode.expandHandler(vm.dataSource, item).then(function(childrens) {
            if (angular.isArray(childrens)) {
              angular.forEach(childrens, function(child, index) {
                child.$options = {
                  $componentId: vm.options.$componentId,
                  regim: 'preview',
                  $dataIndex: index,
                  isSendRequest: true
                };
                child.$isExpand = child.$isExpand || true;
                if (!angular.isArray(child[vm.childrenField]) && child[vm.childrenCountField] > 0) {
                  child.$isExpand = false;
                }
              });
              item[vm.childrenField] = childrens;
              vm.updateNode();
            }
          }, function() {
            item.$isExpand = false;
          }).finally(function() {
            delete item.$sendRequest;
          });
        }
      };

      vm.updateNode = function() {
        $timeout(function() {
          vm.data = vm.data || {
            editorEntityType: 'exist',
            $componentId: vm.options.$componentId,
            $items: vm.items,
            $nodeId: vm.nodeId
          };
          angular.forEach(vm.items, function(item, index) {
            item.$options.$dataIndex = index;
          });
          $scope.$broadcast('ue:nodeDataLoaded', vm.data);
        });
      };

      vm.moved = function(index) {
        if (!vm.isCancelDrop) {
          vm.items.splice(index, 1);
          if (vm.childrenCountField && vm.parentNode) {
            vm.parentNode[vm.childrenCountField]--;
          }
          vm.updateNode();
        }
      };

      vm.dragStart = function(event, item, index) {
        vm.options.$dnd = vm.options.$dnd || {};
        vm.options.$dnd.dragging = item;
        if (vm.dragMode && angular.isFunction(vm.dragMode.start)) {
          vm.dragMode.start(event, item, vm.collection);
        }
      };

      vm.dragover = function(event, index, type) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.over)) {
          var dragging = null;
          if (vm.options.$dnd && vm.options.$dnd.dragging) {
            dragging = vm.options.$dnd.dragging;
          }
          vm.dragMode.over(event, dragging, vm.parentNode, vm.collection);
        }
        return true;
      };

      vm.drop = function(item, index, event) {
        var placeholder = $(".dndPlaceholder");
        vm.isCancelDrop = placeholder.length === 0 || placeholder.css('display') === 'none';
        if (vm.isCancelDrop === true) {
          return false;
        }
        if (vm.dragMode && angular.isFunction(vm.dragMode.drop)) {
          var drop = vm.dragMode.drop(event, item, null, vm.collection);
          if (drop === false) {
            return false;
          }
        }
        return item;
      };
      vm.inserted = function(index, external, type) {
        if (vm.childrenCountField && vm.parentNode) {
          vm.parentNode[vm.childrenCountField]++;
        }
        vm.updateNode();
      };

      vm.getType = function(item, collection) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.type)) {
          return vm.dragMode.type(item, collection);
        }
        if (vm.dragMode && angular.isString(vm.dragMode.type)) {
          return vm.dragMode.type;
        }
        return null;
      };

      vm.allowedTypes = function(item, collection) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.type)) {
          return vm.dragMode.allowedTypes(item, collection);
        }
        if (vm.dragMode && angular.isArray(vm.dragMode.allowedTypes)) {
          return vm.dragMode.allowedTypes;
        }
        return null;
      };

      vm.dragDisable = function(item, collection) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.dragDisable)) {
          return vm.dragMode.dragDisable(item, collection);
        }
        if (vm.dragMode && angular.isArray(vm.dragMode.dragDisable)) {
          return vm.dragMode.dragDisable;
        }
        return null;
      };

    };
  }
})();
