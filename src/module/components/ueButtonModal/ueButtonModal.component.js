(function () {
    'use strict';

    var ueButtonModal = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonModal/ueButtonModal.html');
        }],
        bindings : {
            setting: '<',
            options: '<'
        },
        controller : 'UeButtonModalController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonModal',ueButtonModal);
})();
