(function () {
    'use strict';

    var ueButtonService = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonService/ueButtonService.html');
        }],
        bindings : {
            setting: '=',
            options: '='
        },
        controller : 'UeButtonServiceController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonService',ueButtonService);
})();