(function () {
    'use strict';

    var ueButtonDelete = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonDelete/ueButtonDelete.html');
        }],
        bindings : {
            entityId : "@",
            buttonLabel : "@",
            buttonRequest : "@",
            entityName : "@",
            buttonClass: "@",
            entityType: "@"
        },
        controller : 'UeButtonDeleteController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonDelete',ueButtonDelete);
})();