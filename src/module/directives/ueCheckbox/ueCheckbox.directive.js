(function () {
    'use strict';

    /**
     * @desc Checkbox-type field.
     * @example <ue-checkbox></ue-checkbox>
     */
    angular
        .module('universal.editor')
        .directive('ueCheckbox', ueCheckbox);

    ueCheckbox.$inject = ['$templateCache'];

    function ueCheckbox($templateCache){
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
            template : $templateCache.get('module/directives/ueCheckbox/ueCheckbox.html'),
            controller: 'UeCheckboxController',
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