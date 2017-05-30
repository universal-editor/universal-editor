(function() {
  'use strict';
  angular
    .module('universal-editor')
    .controller('UeNodeController', UeNodeController)
    .directive('ngSetValueReplace', function($templateCache, $compile) {
      'ngInject';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          item: '=',
          componentId: '@',
          settings: '=',
          vm: '='
        },
        link: function(scope, element, attr) {
          var vm = scope.vm, tr;
          if (vm.dataSource.tree) {
            tr = angular.element($templateCache.get('module/components/ueGrid/template/nodeRow.html'));
            if (vm.dragMode && vm.dragMode.dragIcon) {
              tr.attr('dnd-nodrag', '').append('<div class="dnd-expand-item glyphicon glyphicon-align-justify dragIcon" dnd-handle> </div>');
            }
          }
          element.append($compile(angular.element(tr))(scope));

          if (scope.item[vm.childrenCountField] > 0) {
            if (typeof scope.item.$$expand !== 'boolean') {
              scope.item.$$expand = angular.isArray(scope.item[vm.childrenField]);
            }
          }

          scope.$on('readyToLoaded', function(event, data) {
            if (data) {
              if (scope.item === data) {
                emitLoading();
              }
            } else {
              emitLoading();
            }
          });
          function emitLoading() {
            var data = vm.selfField ? scope.item[vm.selfField] : scope.item;
            scope.$broadcast('ue:componentDataLoaded', {
              $componentId: scope.componentId,
              $value: data
            });
          }
        }
      };
    });

  function UeNodeController($scope, ApiService, $timeout, $rootScope, $element, $translate, toastr, dragOptions) {
    /* jshint validthis: true */
    'ngInject';
    var vm = this;
    vm.$onInit = function() {
      vm.dragMode = vm.setting.component.settings.dragMode;
      vm.dataSource = vm.setting.component.settings.dataSource;
      vm.loaded = true;
      vm.treeSource = vm.dataSource.tree;
      vm.$componentId = vm.options.$componentId;

      if (vm.treeSource) {
        vm.childrenField = vm.treeSource.childrenField;
        vm.childrenCountField = vm.treeSource.childrenCountField;
        vm.selfField = vm.treeSource.selfField;
      }

      vm.expand = function(item) {
        if (typeof item.$$expand === 'boolean') {
          item.$$expand = !item.$$expand;
          if (vm.dragMode && angular.isFunction(vm.dragMode.expand) && vm.childrenField && !angular.isArray(item[vm.childrenField])) {
            item.$$expand = 'pending';
            vm.dragMode.expand(vm.dataSource, item).then(function(childrens) {
              getExpanded(childrens).then(function() {
                if (angular.isArray(childrens)) {
                  item[vm.childrenField] = childrens;
                  vm.updateTable();
                }
              }, reject);
            }, reject).finally(function() {
              item.$$expand = true;
            });
            function reject() {
              item.$$expand = false;
              item[vm.childrenCountField] = 0;
              $translate('UE-GRID.TREE.EXPAND_ERROR').then(function(translation) {
                toastr.error(translation);
              });
            }
          }
        }
      };

      function getExpanded(items) {
        var components = vm.tableFields.map(function(f) { return f.component; });
        var options = {
          data: items,
          components: components,
          $id: vm.$componentId,
          standart: vm.dataSource.standart,
          childrenField: vm.childrenField,
          selfField: vm.selfField
        };
        return ApiService.extendData(options);
      }

      vm.updateTable = function(item) {
        $timeout(function() {
          if (item) {
            $scope.$broadcast('childrenReadyToLoaded', item);
            $scope.$broadcast('readyToLoaded', item);
          } else {
            $scope.$broadcast('readyToLoaded');
          }
        });
      };
      $scope.$on('childrenReadyToLoaded', function(event, item) {
        if (vm.parentNode == item) {
          $scope.$broadcast('readyToLoaded');
        }
      });

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
        if (typeof vm.options.$dnd.dragging.$$expand === 'boolean') {
          item.$$expand = vm.options.$dnd.dragging.$$expand;
        }
        if (vm.dragMode && angular.isFunction(vm.dragMode.drop)) {
          var drop = vm.dragMode.drop(event, item, vm.parentNode, vm.collection);
          if (drop === false) {
            return false;
          }
          if (angular.isObject(drop)) {
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

        vm.updateTable(item);
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
