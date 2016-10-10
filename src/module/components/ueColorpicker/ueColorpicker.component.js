(function () {
    'use strict';

    var ueColorpicker = {
        bindings : {
            field: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueColorpicker/ueColorpicker.html');
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