(function () {
    'use strict';

    var ueButtonDownload = {
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueButtonDownload/ueButtonDownload.html');
        }],
        bindings : {
            itemValue : "=",
            buttonLabel : "@",
            buttonRequest : "@",
            index: "@",
            buttonClass: "@"
        },
        controller : 'UeButtonDownloadController',
        controllerAs : 'vm'
    };

    angular
        .module('universal.editor')
        .component('ueButtonDownload',ueButtonDownload);
})();
