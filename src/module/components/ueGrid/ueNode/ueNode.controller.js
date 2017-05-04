(function() {
  'use strict';
  angular
    .module('universal-editor')    
    .controller('UeNodeController', UeNodeController);

  function UeNodeController($scope, ApiService, $timeout, $rootScope, $element, $translate, toastr, dragOptions) {
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

      function getRandomId() {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
          function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16);
          }
        );
      }

      vm.expand = function(item) {
        item.$isExpand = !item.$isExpand;
        if (vm.dragMode && angular.isFunction(vm.dragMode.expand) && vm.childrenField && !angular.isArray(item[vm.childrenField]) && !item.$sendRequest) {
          item.$sendRequest = true;
          vm.dragMode.expand(vm.dataSource, item).then(function(childrens) {
            getExpanded(childrens);
            if (angular.isArray(childrens)) {
              angular.forEach(childrens, function(child, index) {
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
            item[vm.childrenCountField] = 0;
            $translate('UE-GRID.TREE.EXPAND_ERROR').then(function(translation) {
              toastr.error(translation);
            });
          }).finally(function() {
            delete item.$sendRequest;
          });
        }
      };

      function getExpanded(items) {
        var components = vm.tableFields.map(function(f) { return f.component; });
        if (angular.isObject(items)) {
          angular.forEach(items, function(item, index) {
            item.$options = item.$options || {
              $componentId: vm.$componentId,
              regim: 'preview',
              $dataIndex: index,
              isSendRequest: true
            };
          });
        }
        var options = {
          data: items,
          components: components,
          $id: vm.$componentId,
          standart: vm.dataSource.standart,
          childrenField: vm.childrenField,
          selfField: vm.selfField
        };
        ApiService.extendData(options).then(function(data) {
          vm.data.$item = data;
          vm.updateNode();
        });
      }

      vm.updateNode = function() {
        $timeout(function() {
          vm.data = vm.data || {
            editorEntityType: 'exist',
            $componentId: vm.options.$componentId,
            $nodeId: vm.nodeId
          };
          vm.data.$items = vm.items;
          angular.forEach(vm.items, function(item, index) {
            item.$options = item.$options || {};
            item.$options.$componentId = vm.options.$componentId;
            item.$options.regim = 'preview';
            item.$options.$dataIndex = index;
            item.$options.isSendRequest = true;
          });
          $scope.$broadcast('ue:nodeDataLoaded', vm.data);
        });
      };

      vm.moved = function(index) {
        var disabled = angular.isFunction(vm.dragMode.dragDisable) ? vm.dragMode.dragDisable(vm.items[index], vm.collection) : false;
        if (!vm.isCancelDrop) {
          if (!disabled) {
            vm.items.splice(index, 1);
            if (vm.childrenCountField && vm.parentNode) {
              vm.parentNode[vm.childrenCountField]--;
            }

            if (vm.dragMode && angular.isFunction(vm.dragMode.inserted)) {
              if (dragOptions.insertedNode.parentNode === vm.parentNode && index <= dragOptions.insertedNode.index) {
                dragOptions.insertedNode.index--;
              }
              vm.dragMode.inserted(event, dragOptions.insertedNode.index, dragOptions.insertedNode.item, dragOptions.insertedNode.parentNode, vm.collection);
            }
          }
          vm.updateNode();
        }
      };

      vm.dragStart = function(event, item, index) {
        vm.options.$dnd = vm.options.$dnd || {};
        vm.options.$dnd.dragging = item;
        //document.body.style.cursor = '-webkit-grabbing';
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
        var $options = item.$options;
        if (vm.dragMode && angular.isFunction(vm.dragMode.drop)) {
          var drop = vm.dragMode.drop(event, item, vm.parentNode, vm.collection);
          if (drop === false) {
            return false;
          }
          if (angular.isObject(drop)) {
            drop.$options = $options;
            if (vm.selfField) {
              drop[vm.selfField].$options = drop.$options;
            }
            return drop;
          }
        }
        return item;
      };
      vm.inserted = function(item, index, external, type) {
        dragOptions.insertedNode.index = index;
        dragOptions.insertedNode.parentNode = vm.parentNode;
        dragOptions.insertedNode.item = item;
        if (vm.childrenCountField && vm.parentNode) {
          vm.parentNode[vm.childrenCountField]++;
        }
        $(".dndPlaceholder").remove();
        vm.updateNode();
        if (vm.dragMode && vm.dragMode.mode === 'copy' && angular.isFunction(vm.dragMode.inserted)) {
          vm.dragMode.inserted(event, index, item, vm.parentNode, vm.collection);
        }
      };

      vm.getContainerName = function(item, collection) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.containerName)) {
          return vm.dragMode.containerName(item, collection);
        }
        if (vm.dragMode && angular.isString(vm.dragMode.containerName)) {
          return vm.dragMode.containerName;
        }
        return null;
      };

      vm.getAllowedContainers = function(item, collection) {
        if (vm.dragMode && angular.isFunction(vm.dragMode.allowedContainers)) {
          return vm.dragMode.allowedContainers(item, collection);
        }
        if (vm.dragMode && angular.isArray(vm.dragMode.allowedContainers)) {
          return vm.dragMode.allowedContainers;
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
