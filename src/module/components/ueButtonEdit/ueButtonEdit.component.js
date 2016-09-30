(function () {
    'use strict';

    var ueButtonEdit = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonEdit/ueButtonEdit.html');
        }],
        bindings : {
            setting: '='
            //entityId : "@",
            //buttonLabel : "@",
            //buttonRequest : "@",
            //entitySubtype : "@"
        },
        controller : 'UeButtonEditController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonEdit',ueButtonEdit);
})();