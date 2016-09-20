(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <ue-string></ue-string>
     */
    angular
        .module('universal.editor')
        .directive('ueString',ueString);

    ueString.$inject = ['$templateCache'];

    function ueString($templateCache){
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
            template : $templateCache.get('module/directives/ueString/ueString.html'),
            controller: 'UeStringController',
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