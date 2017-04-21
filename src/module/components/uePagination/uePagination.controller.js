(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UePaginationController', UePaginationController);

    function UePaginationController($scope, ApiService, $httpParamSerializer, $sce, $location, $element) {
        'ngInject';
        $element.addClass('ue-pagination');

        var vm = this;

        vm.$onInit = function() {
            vm.metaKey = true;
            vm.parentComponentId = vm.options.$componentId;
            vm.changePage = changePage;
        };

        var watchData = $scope.$watch(function() {
            return vm.setting.paginationData;
        }, function(data) {

            var metaKey = '_meta';
            var itemsKey = 'items';
            var pageItems = vm.setting.component.settings.maxSize || 7;

            var url = vm.setting.component.settings.dataSource.url;
            var parentField = vm.setting.component.settings.dataSource.parentField;
            var startIndex;
            var endIndex;

            vm.request = {
                params: {},
                options: vm.options,
                parentField: parentField,
                url: url
            };

            vm.dataSource = vm.setting.component.settings.dataSource;

            vm.pageItemsArray = [];
            vm.items = vm.setting.paginationData[itemsKey];
            var label = {
                last: '>>',
                next: '>',
                first: '<<',
                previous: '<',
                lastIs: true,
                nextIs: true,
                firstIs: true,
                previousIs: true
            };

            if (!!vm.setting.component.settings.label) {
                angular.forEach(['last', 'next', 'first', 'previous'], function(val) {
                    if (angular.isDefined(vm.setting.component.settings.label[val])) {
                        if (vm.setting.component.settings.label[val]) {
                            label[val] = vm.setting.component.settings.label[val];
                        } else {
                            label[val + 'Is'] = false;
                        }
                    }
                });
            }

            if (angular.isDefined(vm.setting.component.settings.dataSource.keys)) {
                metaKey = vm.setting.component.settings.dataSource.keys.meta || metaKey;
                itemsKey = vm.setting.component.settings.dataSource.keys.items || itemsKey;
                vm.metaKey = (vm.setting.component.settings.dataSource.keys.meta != false);
            }

            if (!!vm.items && vm.items.length === 0) {
                vm.metaKey = false;
            }

            if (!!data[metaKey]) {
                vm.metaData = data[metaKey];
                vm.metaData.fromItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage) + 1;
                vm.metaData.toItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage) + data[itemsKey].length;

                if (data[metaKey].currentPage > 1) {

                    if (label.firstIs) {
                        vm.pageItemsArray.push({
                            label: label.first,
                            page: 1
                        });
                    }

                    if (label.previousIs) {
                        vm.pageItemsArray.push({
                            label: label.previous,
                            page: data[metaKey].currentPage - 1
                        });
                    }
                }

                if (data[metaKey].currentPage <= parseInt(pageItems / 2)) {
                    startIndex = 1;
                } else if (data[metaKey].currentPage > (data[metaKey].pageCount - pageItems + 1)) {
                    startIndex = Math.max(data[metaKey].pageCount - pageItems + 1, 1);
                }
                else {
                    startIndex = Math.max(data[metaKey].currentPage - parseInt(pageItems / 2), 1);
                }

                endIndex = Math.min(startIndex + pageItems - 1, data[metaKey].pageCount);

                if (startIndex > 1) {
                    vm.pageItemsArray.push({
                        label: '...',
                        page: startIndex - 1
                    });
                }

                for (var i = startIndex; i <= endIndex; i++) {
                    if (i !== data[metaKey].currentPage) {
                        vm.pageItemsArray.push({
                            label: i,
                            page: i
                        });
                    } else {
                        vm.pageItemsArray.push({
                            label: data[metaKey].currentPage,
                            self: true
                        });
                    }
                }

                if (endIndex < data[metaKey].pageCount) {
                    vm.pageItemsArray.push({
                        label: '...',
                        page: endIndex + 1
                    });
                }

                if (data[metaKey].currentPage < data[metaKey].pageCount) {

                    if (label.nextIs) {
                        vm.pageItemsArray.push({
                            label: label.next,
                            page: data[metaKey].currentPage + 1
                        });
                    }

                    if (label.lastIs) {
                        vm.pageItemsArray.push({
                            label: label.last,
                            page: data[metaKey].pageCount
                        });
                    }
                }
            }
        });

        function changePage(event, pageItem) {
            event.preventDefault();
            vm.request.params.page = pageItem.page;
            var parentEntity = $location.search()[getKeyPrefix('parent')];
            vm.parent = parentEntity || null;
            vm.request.childId = vm.parent;
            $location.search(getKeyPrefix('page'), pageItem.page);
            ApiService.getItemsList(vm.request, true);
        }

        function getKeyPrefix(key) {
            if (!key && vm.options.prefixGrid) {
                return vm.options.prefixGrid;
            }
            return vm.options.prefixGrid ? (vm.options.prefixGrid + '-' + key) : key;
        }

        vm.$onDestroy = function() {
            watchData();
        };
    }
})();