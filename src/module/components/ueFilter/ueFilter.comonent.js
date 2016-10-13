(function () {
    'use strict';

    angular.module('universal.editor').component('ueFilter', {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueFilter/ueFilter.html');
        }],
        bindings: {
            setting: '='
        },
        controllerAs: 'vm',
        controller: 'UeFilterController'
    });
})();