(function () {
    'use strict';

    /**
     * @desc Colorpicker-type field.
     * @example <ue-colorpicker></ue-colorpicker>
     */
    angular
        .module('universal.editor')
        .directive('ueColorpicker',ueColorpicker);

    ueColorpicker.$inject = ['$templateCache'];

    function ueColorpicker($templateCache){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                field: "=",
                setError: "=",
                setErrorEmpty: "=",
                errorIndexOf: "=",
                parentField: "=",
                parentFieldIndex: "="
            },
            template : $templateCache.get('module/directives/ueColorpicker/ueColorpicker.html'),
            controller: 'UeColorpickerController',
            controllerAs : 'vm',
            link : link,
            bindToController: true
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();