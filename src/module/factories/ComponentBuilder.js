(function () {
    'use strict';

    angular
        .module('universal-editor')
        .factory('ComponentBuilder',ComponentBuilder);

    function ComponentBuilder($compile){
        'ngInject';
        var Component = function (scope) {
            scope.setting.component.$id = scope.setting.component.$id || getRandomId();
            this.scope = scope.$new();
            this.scope.setting = scope.setting;
            this.scope.options = scope.options;
        };

        Component.prototype.build = function () {
            var element = '<' + this.scope.setting.component.name +' class="field-wrapper-' + this.scope.setting.component.name + '" data-setting="::setting" data-options="::options"></' + this.scope.setting.component.name + '>';
            return $compile(element)(this.scope);
        };

        function getRandomId() {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
                }
            );
        }
        return Component;
    }
})();