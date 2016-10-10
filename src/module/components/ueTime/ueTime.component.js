(function () {
    'use strict';

    var ueTime = {
        bindings : {
            field: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueTime/ueTime.html');
        }],
        controller: 'UeTimeController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-time></ue-time>
     */
    angular
        .module('universal.editor')
        .component('ueTime', ueTime);
})();