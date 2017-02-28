(function () {
    'use strict';

    var ueButton = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButton/ueButton.html');
        }],
        bindings : {
            setting: '<',
            options: '<'
        },
        controller : 'UeButtonController',
        controllerAs : 'vm'
    };

    angular
        .module('universal-editor')
        .component('ueButton', ueButton);
})();