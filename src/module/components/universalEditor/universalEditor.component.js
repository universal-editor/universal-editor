(function () {
    'use strict';

    var universalEditor = {
        bindings : {
            ueConfig: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/universalEditor/universalEditor.html');
        }],
        controller: 'UniversalEditorController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <universal-editor></universal-editor>
     */
    angular
        .module('universal-editor')
        .component('universalEditor',universalEditor);
})();