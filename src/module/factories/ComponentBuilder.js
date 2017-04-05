(function () {
    'use strict';

    angular
        .module('universal-editor')
        .factory('ComponentBuilder',ComponentBuilder);

    function ComponentBuilder($compile){
        'ngInject';
        var Component = function (scope) {
            this.scope = scope.$new();
            this.scope.setting = scope.setting;
            this.scope.options = scope.options;
        };

        Component.prototype.build = function () {
            var element = '<' + this.scope.setting.component.name +' class="field-wrapper-' + this.scope.setting.component.name + '" data-setting="::setting" data-options="::options"></' + this.scope.setting.component.name + '>';
            return $compile(element)(this.scope);
        };

        return Component;
    }
})();