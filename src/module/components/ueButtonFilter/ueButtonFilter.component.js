(function () {
    'use strict';

    var ueButtonFilter = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonFilter/ueButtonFilter.html');
        }],
        bindings : {
            setting: '='
        },
        controller : 'UeButtonFilterController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonFilter',ueButtonFilter);
})();
