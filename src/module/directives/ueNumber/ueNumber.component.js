(function () {
    'use strict';

    var ueNumber = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueNumber/ueNumber.html');
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