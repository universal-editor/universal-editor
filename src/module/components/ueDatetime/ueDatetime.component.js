(function () {
    'use strict';

    var ueDatetime = {
         bindings : {
            setting: '=',
            filter: '=',
            filterParameters: '='
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/components/ueDatetime/ueDatetime.html');
        }],
        controller: 'UeDatetimeController',
        controllerAs : 'vm'
    };

    /**
     * @desc Datetime-type field.
     * @example <div editor-field-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .component('ueDatetime', ueDatetime);
})();