(function () {
    'use strict';

    var ueButtonOpen = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonOpen/ueButtonOpen.html');
        }],
        bindings : {
            entityId : "@",
            buttonLabel : "@",
            buttonRequest : "@"
        },
        controller : 'UeButtonOpenController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonOpen', ueButtonOpen);
})();
