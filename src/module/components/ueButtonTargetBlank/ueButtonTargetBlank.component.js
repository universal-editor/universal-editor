(function () {
    'use strict';

    var ueButtonTargetBlank = {
        template : ['$templateCache',function() {
            $templateCache.get('module/components/ueButtonTargetBlank/ueButtonTargetBlank.html')
        }],
        bindings : {
            itemValue : "=",
            buttonLabel : "@",
            buttonRequest : "@",
            index: "@",
            buttonClass: "@"
        },
        controller : 'UeButtonTargetBlankController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonTargetBlank',ueButtonTargetBlank);
})();
