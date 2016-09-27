(function () {
    'use strict';

    var ueButtonPresave = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonPresave/ueButtonPresave.html');
        }],
        bindings : {
            entityId : "@",
            buttonLabel : "@",
            buttonRequest : "@"
        },
        controller : 'UeButtonPresaveController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonPresave',ueButtonPresave);
})();