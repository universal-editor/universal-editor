(function () {
    'use strict';

    var ueButtonDelete = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonDelete/ueButtonDelete.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonDeleteController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonDelete',ueButtonDelete);
})();