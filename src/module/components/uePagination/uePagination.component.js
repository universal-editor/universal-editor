(function () {
    'use strict';

    var uePagination = {
        bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/uePagination/uePagination.html');
        }],
        controller: 'UePaginationController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-pagination></ue-pagination>
     */
    angular
        .module('universal-editor')
        .component('uePagination',uePagination);
})();