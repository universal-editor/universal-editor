(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UePaginationController', UePaginationController);

    UePaginationController.$inject = ['$scope', 'RestApiService', '$httpParamSerializer'];

    function UePaginationController($scope, RestApiService, $httpParamSerializer) {
        var vm = this;
        vm.pagination = true;
        vm.metaKey = true;
        var metaKey = '_meta',
            itemsKey = 'items',
            pageItems = 3;
        vm.items = vm.data[itemsKey];


        var startIndex;
        var endIndex;
        var qParams = RestApiService.getQueryParams();
        vm.pageItemsArray = [];
        var url = "//universal-backend.dev/rest/v1/staff";
        vm.isPagination = false;
        var watchData = $scope.$watch(function() {
            return vm.data;
        }, function(data) {
            //if (vm.items.length === 0) {
            //    vm.metaKey = false;
            //}
            if (!!data[metaKey]) {

                vm.metaData = data[metaKey];
                vm.metaData.fromItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + 1;
                vm.metaData.toItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + data[itemsKey].length;

                if(data[metaKey].currentPage > 1){
                    qParams.page = 1;
                    vm.pageItemsArray.push({
                        label : "<<",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].currentPage - 1;
                    vm.pageItemsArray.push({
                        label : "<",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage > pageItems + 1){
                    qParams.page = data[metaKey].currentPage - pageItems - 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if( data[metaKey].currentPage - pageItems > 0){
                    startIndex = data[metaKey].currentPage - pageItems;
                } else {
                    startIndex = 1;
                }

                while(startIndex < data[metaKey].currentPage){
                    qParams.page = startIndex;
                    vm.pageItemsArray.push({
                        label : startIndex,
                        href : url + "?" + $httpParamSerializer(qParams)
                    });

                    startIndex++;
                }

                vm.pageItemsArray.push({
                    label : data[metaKey].currentPage,
                    self : true
                });

                if( data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    endIndex = data[metaKey].currentPage + pageItems;
                } else {
                    endIndex = data[metaKey].pageCount;
                }

                var tempCurrentPage = data[metaKey].currentPage + 1;

                while(tempCurrentPage <= endIndex){
                    qParams.page = tempCurrentPage;
                    vm.pageItemsArray.push({
                        label : tempCurrentPage,
                        href : url + "?" + $httpParamSerializer(qParams)
                    });

                    tempCurrentPage++;
                }

                if(data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + pageItems + 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + 1;
                    vm.pageItemsArray.push({
                        label : ">",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].pageCount;
                    vm.pageItemsArray.push({
                        label : ">>",
                        href : url + "?" + $httpParamSerializer(qParams)
                    });
                }
            }
        });

        vm.changePage = function (event, linkHref) {
            event.preventDefault();
            vm.listLoaded = false;
            var params = linkHref.split("?")[1];
            RestApiService.getItemsListWithParams(params, vm.scopeIdParent);
        };

        vm.$onDestroy = function() {
            watchData();
        }
    }
})();