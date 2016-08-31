(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterSelectController', EditorFilterSelectController);

    EditorFilterSelectController.$inject = ['$scope', 'FilterFieldsStorage', 'RestApiService', '$location', '$timeout', '$element', '$document'];

    function EditorFilterSelectController($scope, FilterFieldsStorage, RestApiService, $location, $timeout, $element, $document) {
        /* jshint validthis: true */
        var vm = this;

        var remote = $scope.filter.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.selectedValues = [];
        vm.placeholder = $scope.filter.placeholder || '';
        vm.activeElement = 0;
        var possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);

        FilterFieldsStorage.addFilterController(this);

        if ($scope.filter.hasOwnProperty("values")) {
            if ($location.search()[vm.filterName]) {
                vm.filterValue = parseInt($location.search()[vm.filterName]);
            }
            angular.forEach($scope.filter.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
                if ($location.search()[vm.filterName] && key == vm.filterValue) {
                    vm.placeholder = v;
                }
            });
        } else if ($scope.filter.hasOwnProperty("valuesRemote")) {
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    if ($location.search()[vm.filterName]) {
                        vm.filterValue = parseInt($location.search()[vm.filterName]);
                    }
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                        if ($location.search()[vm.filterName] && v[vm.field_id] == vm.filterValue) {
                            vm.placeholder = v[vm.field_search];
                        }
                    });
                }, function (reject) {
                    console.error('EditorFilterSelectController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        this.getFilterValue = function () {

            var field = {};

            if (vm.filterValue !== null) {
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterValue] = [];

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = null;
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        /*
         * При изменении значения поля - меняется параметр url.
         * При инициализации поля - текущее значение селекта берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if (newVal !== undefined) {
                $location.search(vm.filterName, newVal);
            }
        });

        vm.addToSelected = function (val) {
            vm.filterValue = val[vm.field_id];
            vm.filterText = '';
            $timeout(function () {
                vm.placeholder = (!!val && !!val[vm.field_search]) ? val[vm.field_search] : $scope.filter.placeholder;
                vm.showPossible = false;
            }, 0);
        };

        vm.isShowPossible = function (event) {
            vm.activeElement = 0;
            vm.showPossible = true;
            event.stopPropagation();
        };

        $document.bind("keydown", function (event) {
            if (vm.showPossible) {
                switch (event.which) {
                    case 27:
                        event.preventDefault();
                        $timeout(function () {
                            vm.showPossible = false;
                        }, 0);
                        break;
                    case 13:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        $timeout(function () {
                            vm.addToSelected(vm.selectedValues[vm.activeElement]);
                        }, 0);

                        break;
                    case 40:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);

                        if (vm.activeElement < vm.selectedValues.length - 1) {
                            $timeout(function () {
                                vm.activeElement++;
                            }, 0);

                            $timeout(function () {
                                var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                    activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                    wrapperScroll = possibleValues[0].scrollTop,
                                    wrapperHeight = possibleValues[0].clientHeight;

                                if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                    possibleValues[0].scrollTop += activeHeight + 1;
                                }
                            }, 1);
                        }
                        break;
                    case 38:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);

                        if (vm.activeElement > 0) {
                            $timeout(function () {
                                vm.activeElement--;
                            }, 0);

                            $timeout(function () {
                                var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                    activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                    wrapperScroll = possibleValues[0].scrollTop,
                                    wrapperHeight = possibleValues[0].clientHeight;

                                if (activeTop < wrapperScroll) {
                                    possibleValues[0].scrollTop -= activeHeight + 1;
                                }
                            }, 1);
                        }
                        break;
                }
            }
        });
    }
})();
