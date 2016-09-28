(function () {
    'use strict';

    var ueButtonTargetBlank = {
        template : ['$templateCache',function($templateCache) {
            return $templateCache.get('module/components/ueButtonTargetBlank/ueButtonTargetBlank.html');
        }],
        bindings : {
            setting: '='
            //itemValue : "=",
            //buttonLabel : "@",
            //buttonRequest : "@",
            //index: "@",
            //buttonClass: "@"
        },
        controller : 'UeButtonTargetBlankController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonTargetBlank',ueButtonTargetBlank);
})();
