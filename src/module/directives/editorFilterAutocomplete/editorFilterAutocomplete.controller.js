(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterAutocompleteController', EditorFilterAutocompleteController);

    EditorFilterAutocompleteController.$inject = ['$scope', '$element', 'FilterFieldsStorage', '$location', 'RestApiService', '$timeout', 'ArrayFieldStorage'];

    function EditorFilterAutocompleteController($scope, $element, FilterFieldsStorage, $location, RestApiService, $timeout, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var filterErrorName = $scope.filterName;
        var inputTimeout;
        var possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

        var remote = $scope.filter.valuesRemote;
        vm.filter_id = "id";
        vm.filter_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.filter_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.filter_search = remote.fields.label;
                } else {
                    vm.filter_search = vm.filter_id;
                }
            }
        }
        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.selectedValues = [];
        vm.activeElement = 0;
        vm.preloadedData = false;
        vm.searching = false;
        vm.minCount = $scope.filter.minCount || 2;

        vm.filterValue = $location.search()[vm.filterName] || '';
        vm.inputValue = '';
        vm.classInput = {
            'width': '99%',
            'padding-right': '25px'
        };
        vm.showPossible = false;
        vm.placeholder = '';

        loadValues();

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        $element.find("input").bind("keydown", function (event) {
            switch (event.which) {
                case 13:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    $timeout(function () {
                        vm.addToSelected(event, vm.possibleValues[vm.activeElement]);
                    }, 0);

                    break;
                case 40:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

                    if (vm.activeElement < vm.possibleValues.length - 1) {
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
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

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
        });

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {
            var field = {};
            if (vm.filterValue !== "") {
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        /*
         * Filter system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var filter = {};
            filter[vm.filterName] = '';
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = '';
            vm.selectedValues = [];
            vm.inputValue = '';
            vm.placeholder = '';
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
         * При инициализации поля - текущее значение поля берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.inputValue;
        }, function (newVal) {
            if (inputTimeout) {
                $timeout.cancel(inputTimeout);
            }
            vm.possibleValues = [];
            inputTimeout = $timeout(function () {
                autocompleteSearch(newVal);
            }, 300);
        });

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if (newVal !== "") {
                $location.search(vm.filterName, newVal);
            } else {
                $location.search(vm.filterName, null);
            }
        });

        /* PUBLIC METHODS */

        vm.addToSelected = function (event, obj) {
            vm.selectedValues = [];
            vm.selectedValues.push(obj);
            vm.filterValue = obj['id'];
            vm.inputValue = '';
            vm.possibleValues = [];
            vm.placeholder = obj[vm.filter_search];
            event.stopPropagation();
        };

        vm.removeFromSelected = function (event) {
            vm.selectedValues = [];
            vm.filterValue = '';
            vm.placeholder = '';
        };

        /* PRIVATE METHODS */

        function autocompleteSearch(searchString) {
            if (searchString === "" || searchString.length <= vm.minCount) {
                return;
            }

            vm.searching = true;

            if ($scope.filter.hasOwnProperty("values")) {
                angular.forEach($scope.filter.values, function (v, key) {
                    var obj = {};
                    obj[vm.filter_id] = key;
                    obj[vm.filter_search] = v;
                    if (containsString(v, searchString) && !alreadySelected(obj)) {
                        vm.possibleValues.push(obj);
                    }
                });
                vm.activeElement = 0;
                vm.searching = false;
            } else {
                var urlParam = {};
                urlParam[vm.filter_search] = "%" + searchString + "%";
                RestApiService
                    .getUrlResource($scope.filter.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function (response) {
                        angular.forEach(response.data.items, function (v) {
                            if (!alreadySelected(v) && !alreadyInPossible(v)) {
                                vm.possibleValues.push(v);
                            }
                        });
                        vm.activeElement = 0;
                        vm.searching = false;
                    }, function (reject) {
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.filter.name + '\" с удаленного ресурса');
                        vm.searching = false;
                    });
            }
        }

        function containsString(str, search) {
            return (str.toLowerCase().indexOf(search.toLowerCase()) >= 0);
        }

        function alreadyInPossible(obj) {
            var inPossible = false;

            angular.forEach(vm.possibleValues, function (v) {
                if (v[vm.filter_id] == obj[vm.filter_id]) {
                    inPossible = true;
                }
            });

            return inPossible;
        }

        function alreadySelected(obj) {
            var inSelected = false;
            angular.forEach(vm.selectedValues, function (v) {
                if (v[vm.filter_id] == obj[vm.filter_id]) {
                    inSelected = true;
                }
            });
            return inSelected;
        }

        function loadValues() {
            var search = $location.search();
            if ($scope.filter.hasOwnProperty("values")) {
                angular.forEach($scope.filter.values, function (v, key) {
                    var obj = {};
                    if (angular.isArray($scope.filter.values)) {
                        obj[vm.filter_id] = v;
                    } else {
                        obj[vm.filter_id] = key;
                    }
                    obj[vm.filter_search] = v;
                    if (!!search && search.hasOwnProperty(vm.filterName) && search[vm.filterName] == obj[vm.filter_id]) {
                        vm.selectedValues.push(obj);
                        vm.placeholder = obj[vm.filter_search];
                    }
                });
                vm.preloadedData = true;
            } else if ($scope.filter.hasOwnProperty("valuesRemote")) {
                if (vm.filterValue === undefined || vm.filterValue === '') {
                    vm.preloadedData = true;
                    return;
                }

                var urlParam;
                urlParam = {};
                urlParam[vm.filter_id] = [];
                urlParam[vm.filter_id].push(vm.filterValue);
                RestApiService
                    .getUrlResource($scope.filter.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function (response) {
                        if (!!search && search.hasOwnProperty(vm.filterName)) {
                            angular.forEach(response.data.items, function (v) {
                                if (search[vm.filterName] == v[vm.filter_id]) {
                                    vm.selectedValues.push(v);
                                    vm.placeholder = v[vm.filter_search];
                                }
                            });
                        }
                        vm.preloadedData = true;
                    }, function (reject) {
                        vm.preloadedData = true;
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.filter.name + '\" с удаленного ресурса');
                    });
            } else {
                vm.preloadedData = true;
                console.error('EditorFieldAutocompleteController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
            }
        }

        vm.focusPossible = function (isActive) {
            vm.isActivePossible = isActive;
            if (!vm.multiple) {
                if ($element.find('.autocomplete-item').length > 0) {
                    if (isActive) {
                        $element.find('.autocomplete-field-search').removeClass('hidden');
                        $element.find('.autocomplete-item').addClass('opacity-item');
                    } else {
                        $element.find('.autocomplete-field-search').addClass('hidden');
                        $element.find('.autocomplete-item').removeClass('opacity-item');
                    }
                }
            }
        }
    }
})();
