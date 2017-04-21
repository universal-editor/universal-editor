(function () {
    'use strict';

    var ueNode = {
        bindings : {
            collections: '=',
            parentNode: '=',
            items: '=',
            tableFields: '=',
            setting: '=',
            options: '=',
            contextLinks: '=',
            toggleContextViewByEvent: '&'
        },
        template : function ($templateCache) {
            'ngInject';
            return $templateCache.get('module/components/ueGrid/ueNode/ueNode.html');
        },
        controller: 'UeNodeController',
        controllerAs : 'vm'
    };
    angular
        .module('universal-editor')
        .component('ueNode',ueNode);
})();