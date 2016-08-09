(function () {
    'use strict';

    /**
     * @desc Radiolist-type field.
     * @example <div editor-field-radiolist=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldRadiolist',editorFieldRadiolist);

    editorFieldRadiolist.$inject = ['$templateCache'];

    function editorFieldRadiolist($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldRadiolist/editorFieldRadiolist.html'),
            controller: 'EditorFieldRadiolistController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();