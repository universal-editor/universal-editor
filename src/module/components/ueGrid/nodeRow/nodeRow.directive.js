(function() {
    'use strict';

    angular
        .module('universal-editor')
        .directive('nodeRow', function() {
            return {
                replace: true,
                scope: {
                    'nodeId': '=',
                    'options': '=',
                    'contextLinks': '=',
                    'dataSource': '=',
                    'tableFields': '=',
                    'item': '=',
                    'expand': '&'
                },
                templateUrl: 'module/components/ueGrid/nodeRow/nodeRow.html',
                controllerAs: 'vm',
                controller: function($scope) {
                    var vm = this;
                    vm.treeSource = $scope.dataSource.tree;
                    if (vm.treeSource) {
                        vm.childrenField = vm.treeSource.childrenField;
                        vm.childrenCountField = vm.treeSource.childrenCountField;
                        vm.selfField = vm.treeSource.selfField;
                    }
                    vm.options = $scope.options;
                    vm.expand = $scope.expand;
                    vm.tableFields = $scope.tableFields;
                    $scope.$on('nodeRowUpdate', function(e, data) {
                        if (data.$nodeId && data.$nodeId === $scope.nodeId) {
                            $scope.$broadcast('ue:componentDataLoaded', data);
                        }
                    });
                }
            };
        });
})();