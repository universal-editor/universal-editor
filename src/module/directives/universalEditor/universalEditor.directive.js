(function () {
    'use strict';

    /**
     * @desc Main directive used for initiate universal editor.
     * @example <div data-universal-editor></div>
     */
    angular
        .module('universal.editor')
        .directive('universalEditor',universalEditor);

    universalEditor.$inject = ['$templateCache'];

    function universalEditor($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                entity : '@'
            },
            template : $templateCache.get('module/directives/universalEditor/universalEditor.html'),
            controller: 'UniversalEditorController',
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