(function () {
    'use strict';

    var ueButtonRequest = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonRequest/ueButtonRequest.html');
        }],
        bindings : {
            setting: '=',
            options: '='
        },
        controller : 'UeButtonRequestController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonRequest',ueButtonRequest);
})();
