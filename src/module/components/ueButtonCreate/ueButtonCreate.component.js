(function () {
    'use strict';

    var ueButtonCreate = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonCreate/ueButtonCreate.html');
        }],
        bindings : {
            setting : '='
        },
        controller : 'UeButtonCreateController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonCreate',ueButtonCreate);
})();
