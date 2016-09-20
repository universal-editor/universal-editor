(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-time=""></div>
     */
    angular
        .module('universal.editor')
        .directive('ueTime', ueTime);

    ueTime.$inject = ['$templateCache'];

    function ueTime($templateCache){
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
            template : $templateCache.get('module/directives/ueTime/ueTime.html'),
            controller: 'UeTimeController',
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