(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditor.html',
    '\n' +
    '<ul data-ng-if="vm.configData.entities.length &gt; 1" class="nav nav-tabs">\n' +
    '    <li data-ng-repeat="entityItem in vm.configData.entities track by $index" data-ng-class="(entityItem.name === vm.entity) ? \'active\' : \'\'" class="item"><a data-ui-sref="editor.type.list({type: entityItem.name})" ui-sref-opts="{reload: true, inherit: false}">{{entityItem.label}}</a></li>\n' +
    '</ul>\n' +
    '<div class="universal-editor"></div>');
}]);
})();
