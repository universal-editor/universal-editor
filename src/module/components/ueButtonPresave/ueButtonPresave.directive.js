(function () {
    'use strict';

    var ueButtonPresave = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonPresave/ueButtonPresave.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonPresaveController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonPresave',ueButtonPresave);
})();