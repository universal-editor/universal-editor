(function () {
    'use strict';

    var ueButtonRequest = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonRequest1/ueButtonRequest1.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonRequestController1',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonRequest1',ueButtonRequest);
})();
