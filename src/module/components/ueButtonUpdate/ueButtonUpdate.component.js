(function () {
    'use strict';

    var ueButtonUpdate = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonUpdate/ueButtonUpdate.html');
        }],
        bindings : {
            entityId : "@",
            buttonLabel : "@",
            buttonParams : "@"
        },
        controller : 'UeButtonUpdateController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonUpdate', ueButtonUpdate);
})();