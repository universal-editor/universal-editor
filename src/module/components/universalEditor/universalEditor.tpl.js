(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/universalEditor/universalEditor.html',
    '\n' +
    '<ul data-ng-if="vm.menu.length &gt; 1" class="nav nav-tabs">\n' +
    '    <li data-ng-repeat="item in vm.menu track by $index" data-ng-class="(item.name === vm.type) ? \'active\' : \'\'" class="item"><a data-ui-sref="{{item.sref}}" ui-sref-opts="{reload: true, inherit: false}">{{item.label}}</a></li>\n' +
    '</ul>\n' +
    '<div class="universal-editor"></div>');
}]);
})();
