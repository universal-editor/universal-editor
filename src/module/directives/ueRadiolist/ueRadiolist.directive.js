(function () {
    'use strict';

    /**
     * @desc Radiolist-type field.
     * @example <ue-radiolist></ue-radiolist>
     */
    angular
        .module('universal.editor')
        .directive('ueRadiolist', ueRadiolist);

    ueRadiolist.$inject = ['$templateCache'];

    function ueRadiolist($templateCache){
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
            template : $templateCache.get('module/directives/ueRadiolist/ueRadiolist.html'),
            controller: 'UeRadiolistController',
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