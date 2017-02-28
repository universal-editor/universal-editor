(function () {
    'use strict';

    var ueFormTabs = {
        bindings : {
            setting: '<',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueFormTabs/ueFormTabs.html');
        }],
        controller: 'UeFormTabsController',
        controllerAs : 'vm'
    };

    angular
        .module('universal-editor')
        .component('ueFormTabs', ueFormTabs);
})();