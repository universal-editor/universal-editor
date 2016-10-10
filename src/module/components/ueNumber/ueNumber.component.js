(function () {
    'use strict';

    var ueNumber = {
        bindings : {
            setting: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueNumber/ueNumber.html');
        }],
        controller: 'UeNumberController',
        controllerAs : 'vm'
    };

    /**
     * @desc number-type field.
     * @example <ue-number></ue-number>
     */
    angular
        .module('universal.editor')
        .component('ueNumber',ueNumber);
})();