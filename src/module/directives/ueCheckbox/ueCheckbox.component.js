(function () {
    'use strict';

    var ueCheckbox = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueCheckbox/ueCheckbox.html');
        }],
        controller: 'UeCheckboxController',
        controllerAs : 'vm'
    };

    /**
     * @desc Checkbox-type field.
     * @example <ue-checkbox></ue-checkbox>
     */
    angular
        .module('universal.editor')
        .component('ueCheckbox', ueCheckbox);
})();