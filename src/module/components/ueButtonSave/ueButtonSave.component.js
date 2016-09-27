(function () {
    'use strict';

    var ueButtonSave = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonSave/ueButtonSave.html');
        }],
        bindings : {
            entityId : "@",
            buttonLabel : "@",
            buttonParams : "@"
        },
        controller : 'UeButtonSaveController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonSave',ueButtonSave);
})();