(function () {
    'use strict';

    var ueString = {
        bindings : {
            setting: '='
            //parentField: "=",
            //parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueString/ueString.html');
        }],
        controller: 'UeStringController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-string></ue-string>
     */
    angular
        .module('universal.editor')
        .component('ueString',ueString);
})();