(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldsController', FieldsController);

    FieldsController.$inject = ['$scope', '$rootScope', '$location', '$controller', '$timeout', 'FilterFieldsStorage', 'RestApiService'];

    function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, RestApiService) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('BaseController', { $scope: $scope });
        angular.extend(vm, baseController);
        var componentSettings = $scope.vm.setting.component.settings;                
        $scope.vm.parentComponentId = $scope.vm.options.$parentComponentId;

        if ($scope.vm.options.filter) {
            $scope.$watch(function() {
                return $location.search();
            }, function(newVal) {
                
                var propFilter = 'filter' + $scope.vm.parentComponentId;
                if (newVal && newVal[propFilter]) {
                    console.log("Filter generate.");
                        var filter = JSON.parse(newVal[propFilter]);
                        componentSettings.$parseFilter($scope.vm, filter);
                }
            });
        }
    }
})();
