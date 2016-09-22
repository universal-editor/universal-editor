(function () {
    'use strict';

    var ueColorpicker = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueColorpicker/ueColorpicker.html');
        }],
        controller: 'UeColorpickerController',
        controllerAs : 'vm'
    };

    /**
     * @desc Colorpicker-type field.
     * @example <ue-colorpicker></ue-colorpicker>
     */
    angular
        .module('universal.editor')
        .component('ueColorpicker',ueColorpicker);
})();