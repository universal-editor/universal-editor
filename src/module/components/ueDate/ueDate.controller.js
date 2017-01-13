(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeDateController', UeDateController);

    UeDateController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'FilterFieldsStorage', '$controller'];

    function UeDateController($scope, $element, EditEntityStorage, moment, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var componentSettings = vm.setting.component.settings;
        componentSettings.$fieldType = 'date';
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);

        vm.format = vm.format || 'DD.MM.YYYY';
        vm.maxView = vm.maxView || 'year';
        vm.minView = vm.minView || 'date';
        vm.view = vm.view || 'date';

        vm.addItem = addItem;
        vm.removeItem = removeItem;

        $scope.minDate = !vm.minDate ? vm.minDate : moment(vm.minDate, vm.format);
        $scope.maxDate = !vm.maxDate ? vm.maxDate : moment(vm.maxDate, vm.format);


        vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
            $scope.onLoadDataHandler(e, data);
            vm.fieldValue = vm.fieldValue ? moment(vm.fieldValue, vm.format) : "";
            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                vm.equalPreviewValue();
            }
            vm.previewValue = moment(vm.previewValue).format(vm.format);
        }));

        //-- private functions
        function removeItem(index) {
            if (angular.isArray(vm.fieldValue)) {
                vm.fieldValue.forEach(function(value, key) {
                    if (key == index) {
                        vm.fieldValue.splice(index, 1);
                    }                    
                });
            }
        }
        function addItem() {
            vm.fieldValue.push(moment());
        }

        vm.getFieldValue = function () {

            var field = {};

            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment(valueItem).format(vm.format);
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(moment(valueItem).format(vm.format));
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).format(vm.format);
                }
            }

            if (vm.parentField) {
                field[vm.parentField] = {};
                field[vm.parentField][vm.fieldName] = wrappedFieldValue;
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };
    }
})();