(function() {
  'use strict';
  angular
    .module('universal-editor')
    .controller('UeNodeController', UeNodeController)
    .directive('ngTreeItem', function($templateCache, $compile, $rootScope, $timeout, $q) {
      'ngInject';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          item: '=',
          componentId: '@',
          vm: '='
        },
        link: function(scope, element, attr) {
          var vm = scope.vm, tr;
          if (vm.dataSource.tree) {
            tr = angular.element($templateCache.get('module/components/ueGrid/template/nodeRow.html'));
            var colHtml = '<div class="column"> </div>',
              row = tr.filter('.row');
            angular.forEach(vm.tableFields, function(column, index) {
              var col = $(colHtml);
              col.css(column.ngStyle);
              if (index === 0) {
                col.addClass('first-column');
              }
              col.html('<component-wrapper data-setting="vm.tableFields[' + index + '].component", data-options="vm.tableFields[' + index + '].options"> </component-wrapper>');
              row.append(col);
            });

            if (vm.dragMode && vm.dragMode.dragIcon) {
              tr.attr('dnd-nodrag', '');
              row.append('<div class="dnd-expand-item glyphicon glyphicon-align-justify dragIcon" dnd-handle> </div>');
            }
          }
          element.replaceWith($compile(angular.element(tr))(scope));

          if (scope.item[vm.childrenCountField] > 0) {
            if (typeof scope.item.$$expand !== 'boolean') {
              scope.item.$$expand = angular.isArray(scope.item[vm.childrenField]);
            }
          }
          emitLoading();

          scope.$on('ue-grid:updateNodes', function(event, data) {
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

  function UeNodeController($scope, ApiService, $timeout, $rootScope, $element, $translate, toastr, dragOptions, $document) {
    /* jshint validthis: true */
    'ngInject';
    var vm = this;
    vm.$onInit = function() {
      vm.dragMode = vm.setting.component.settings.dragMode;
      vm.dataSource = vm.setting.component.settings.dataSource;

      vm.treeSource = vm.dataSource.tree;
      vm.$componentId = vm.options.$componentId;
      vm.options.$dnd = {};
      vm.mode = vm.dragMode.mode || 'move';

      if (vm.treeSource) {
        vm.childrenField = vm.treeSource.childrenField;
        vm.childrenCountField = vm.treeSource.childrenCountField;
        vm.selfField = vm.treeSource.selfField;
      }

      vm.expand = function(item) {
        if (typeof item.$$expand === 'boolean') {
          var nextValueExtend = !item.$$expand;
          item.$$expand = 'pending';
          if (vm.dragMode && angular.isFunction(vm.dragMode.expand) && vm.childrenField && !angular.isArray(item[vm.childrenField])) {
            vm.dragMode.expand(vm.dataSource, item).then(function(childrens) {
              getExpanded(childrens).then(function() {
                outputChild(childrens, item);
                item.$$expand = true;
              }, reject);
            }, reject);
            function reject() {
              item.$$expand = false;
              item[vm.childrenCountField] = 0;
              $translate('UE-GRID.TREE.EXPAND_ERROR').then(function(translation) {
                toastr.error(translation);
              });
            }
          } else {
            item.$$expand = nextValueExtend;
            var childrens = item[vm.childrenField];
            if (angular.isArray(childrens)) {
              item[vm.childrenField] = childrens;
              $timeout(function() {
                vm.updateTable(item);
              });
            }
          }
        }
      };

      function outputChild(childrens, item) {
        if (angular.isArray(childrens)) {
          item[vm.childrenField] = childrens;
          vm.updateTable(item);
        }
      }

      function getExpanded(items) {
        var components = vm.tableFields.map(function(f) { return f.component; });
        var options = {
          data: items,
          components: components,
          $id: vm.$componentId,
          standard: vm.dataSource.standard,
          childrenField: vm.childrenField,
          selfField: vm.selfField
        };
        return ApiService.extendData(options);
      }

      vm.updateTable = function(item, delay) {
        var t = $timeout(function() {
          if (item) {
            $scope.$broadcast('ue-grid:updateHierarchy', item);
          } else {
            $scope.$broadcast('ue-grid:updateNodes');
          }
        }, delay || 0);
        return t;
      };
      $scope.$on('ue-grid:updateHierarchy', function(event, item) {
        if (vm.parentNode == item) {
          $scope.$broadcast('ue-grid:updateNodes');
        }
        if ((vm.parentNode === null || vm.parentNode === undefined) && (item === null || item === undefined)) {
          $scope.$broadcast('ue-grid:updateNodes');
        }
      });

      vm.moved = function(index) {
        var disabled = angular.isFunction(vm.dragMode.dragDisable) ? vm.dragMode.dragDisable(vm.items[index], vm.collection, vm.parentNode) : false;
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

      function changeDragImgPosition() {
        var liElem = $(event.currentTarget).find('.tree-row')[0];
        if (liElem) {
          var rect = liElem.getBoundingClientRect();
          event.dataTransfer.setDragImage(liElem, rect.width - 15, 15);
        }
      }

      vm.dragStart = function(event, item, index) {
        if (vm.dragMode && vm.dragMode.dragIcon) changeDragImgPosition(event);

        vm.options.$dnd = vm.options.$dnd || {};
        vm.options.$dnd.dragging = item;
        if (vm.dragMode && angular.isFunction(vm.dragMode.start)) {
          vm.dragMode.start(event, item, vm.collection, vm.parentNode, index);
        }
      };

      vm.dndDragend = function() {
        var elemWhithClass = $document[0].getElementsByClassName('ue-dnd-parent-node');
        if (!elemWhithClass.length) return; 
        for(var i=0, len = elemWhithClass.length; i < len; i++) {
          elemWhithClass[i].classList.remove('ue-dnd-parent-node');
        }
      };

      vm.dragover = function(event, index, type) {
        var placeholder = $document[0].getElementsByClassName('dndPlaceholder')[0];
        var parentElement = placeholder.parentNode;

        while(parentElement.localName !== 'li' && parentElement !== null ) {
          parentElement = parentElement.parentNode;
        }

        parentElement.firstElementChild.classList.add('ue-dnd-parent-node');
        $element.on('dragleave', function(event) {
          parentElement.firstElementChild.classList.remove('ue-dnd-parent-node');
        });

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
        if (angular.isObject(vm.options.$dnd.dragging) && typeof vm.options.$dnd.dragging.$$expand === 'boolean') {
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
        fillDraggingOptions(item);
        if (!item.hasOwnProperty('$$expand')) {
          item.$$expand = true;
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
          return vm.dragMode.dragDisable(item, collection, vm.parentNode);
        }
        if (vm.dragMode && angular.isArray(vm.dragMode.dragDisable)) {
          return vm.dragMode.dragDisable;
        }
        return null;
      };

      function fillDraggingOptions(items) {
        if (!angular.isArray(items) && angular.isObject(items)) {
          items = [items];
        }
        vm.$allowed = vm.parentNode ? vm.parentNode.$allowed : vm.getAllowedContainers(null, vm.collection);
        angular.forEach(items, function(item) {
          if (angular.isObject(item)) {
            item.$disable = vm.dragDisable(item, vm.collection, vm.parentNode);
            item.$allowed = vm.getAllowedContainers(item, vm.collection);
            item.$type = vm.getContainerName(item, vm.collection);
            if (!angular.isArray(item[vm.childrenField]) && item[vm.childrenCountField] === 0) {
              item[vm.childrenField] = [];
              item.$$expand = true;
            }
          }
        });
      }
      fillDraggingOptions(vm.items);
    };
  }
})();
