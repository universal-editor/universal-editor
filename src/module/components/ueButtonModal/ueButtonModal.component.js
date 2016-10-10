(function () {
    'use strict';

    var ueButtonRequest = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonModal/ueButtonModal.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonModalController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonModal',ueButtonRequest);
})();
