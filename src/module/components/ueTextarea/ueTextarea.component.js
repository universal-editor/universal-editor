(function () {
    'use strict';

    var ueTextarea = {
        bindings : {
            setting: '=',
            options: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueTextarea/ueTextarea.html');
        }],
        controller: 'UeTextareaController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-textarea></ue-textarea>
     */
    angular
        .module('universal.editor')
        .component('ueTextarea',ueTextarea);
})();