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
      vm.needMoving = false;
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
        if (!vm.$stop) {
          if (vm.items) {
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
            if (extendedData.length > 0) {
              ApiService.extendData({
                data: extendedData,
                components: components,
                $id: vm.options.$componentId,
                standart: vm.dataSource.standart
              }).then(function(data) {
                var eventObject = {
                  editorEntityType: 'exist',
                  $componentId: vm.options.$componentId,
                  $items: data
                };

                $timeout(function() {
                  vm.$stop = true;
                  $scope.$broadcast('ue:componentDataLoaded', eventObject);
                  $scope.$broadcast('ue:nodeDataLoaded', eventObject);
                  vm.$stop = false;
                });
                vm.data = eventObject;
              }).finally(function() { vm.loaded = true; });
            }
          }
        }
      }

      function getRandomId() {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
          function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16);
          }
        );
      }

      vm.expand = function(item) {
        item.$isExpand = !item.$isExpand;
        if (angular.isFunction(vm.dragMode.expandHandler) && vm.childrenField && !angular.isArray(item[vm.childrenField]) && !item.$sendRequest) {
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
        vm.data = vm.data || {
          editorEntityType: 'exist',
          $componentId: vm.options.$componentId,
          $items: vm.items
        };
        $timeout(function() {
          angular.forEach(vm.items, function(item, index) {
            item.$options.$dataIndex = index;
          });
          $scope.$broadcast('ue:nodeDataLoaded', vm.data);
        });
      };

      vm.moved = function(index) {
        if (!vm.needMoving) {
          vm.items.splice(index, 1);
          if (vm.childrenCountField && vm.parentNode) {
            vm.parentNode[vm.childrenCountField]--;
          }
          vm.updateNode();
        }
        vm.needMoving = false;
      };

      vm.dragStart = function(event, item, index) {
        vm.options.$dnd = vm.options.$dnd || {};
        vm.options.$dnd.dragging = item;
        if (angular.isFunction(vm.dragMode.start)) {
          vm.dragMode.start(event, item, vm.collection);
        }
      };

      vm.dragover = function(event, index, type) {
        if (angular.isFunction(vm.dragMode.over)) {
          var dragging = null;
          if (vm.options.$dnd && vm.options.$dnd.dragging) {
            dragging = vm.options.$dnd.dragging;
          }
          vm.dragMode.over(event, dragging, vm.parentNode, vm.collection);
        }
        return true;
      };

      vm.drop = function(item, index, event) {
        if (angular.isFunction(vm.dragMode.drop)) {
          vm.dragMode.drop(event, item, vm.parentNode, vm.collection);
        }

        if (vm.parentNode) {
          var elOver = $(event.target || event.srcElement).closest('li.row-draggable[data-frame-id="' + vm.parentNode[vm.dataSource.primaryKey] + '"]');

          if (elOver.length) {
            vm.needMoving = true;
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
        if (angular.isFunction(vm.dragMode.type)) {
          return vm.dragMode.type(item, collection);
        }
        if (angular.isString(vm.dragMode.type)) {
          return vm.dragMode.type;
        }
        return null;
      };

      vm.allowedTypes = function(item, collection) {
        if (angular.isFunction(vm.dragMode.type)) {
          return vm.dragMode.allowedTypes(item, collection);
        }
        if (angular.isArray(vm.dragMode.allowedTypes)) {
          return vm.dragMode.allowedTypes;
        }
        return null;
      };

      vm.dragDisable = function(item, collection) {
        if (angular.isFunction(vm.dragMode.dragDisable)) {
          return vm.dragMode.dragDisable(item, collection);
        }
        if (angular.isArray(vm.dragMode.dragDisable)) {
          return vm.dragMode.dragDisable;
        }
        return null;
      };
    };
  }
})();
