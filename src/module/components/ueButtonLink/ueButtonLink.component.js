(function () {
    'use strict';

    var ueButtonLink = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonLink/ueButtonLink.html');
        }],
        bindings : {
            setting: '<',
            options: '<'
        },
        controller : 'UeButtonLinkController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonLink',ueButtonLink);
})();