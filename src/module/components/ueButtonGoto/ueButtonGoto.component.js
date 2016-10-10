(function () {
    'use strict';

    var ueButtonGoto = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonGoto/ueButtonGoto.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonGotoController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonGoto',ueButtonGoto);
})();