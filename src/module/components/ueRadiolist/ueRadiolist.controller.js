(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeRadiolistController', UeRadiolistController);

    UeRadiolistController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'FilterFieldsStorage', '$controller'];

    function UeRadiolistController($scope, $element, EditEntityStorage, RestApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        vm.optionValues = [];
        vm.inputValue = '';
        vm.newEntityLoaded = newEntityLoaded;

        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var componentSettings = vm.setting.component.settings;

        vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
            $scope.onLoadDataHandler(e, data);
            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                componentSettings.$loadingPromise.then(function(optionValues) {
                    vm.optionValues = optionValues;
                    vm.equalPreviewValue();
                }).finally(function() {
                    vm.loadingData = false;
                });
            }
        }));

        function newEntityLoaded() {
            vm.fieldValue = vm.setting.component.settings.defaultValue || null;
        }
    }
})();