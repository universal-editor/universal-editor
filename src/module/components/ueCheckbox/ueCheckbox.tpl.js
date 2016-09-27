(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueCheckbox/ueCheckbox.html',
    '\n' +
    '<div>\n' +
    '    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div data-ng-repeat="item in vm.selectedValues" data-ng-class="vm.readonly ? \'disabled\' : \'\'" class="checkbox">\n' +
    '            <label>\n' +
    '                <input type="checkbox" data-ng-disabled="vm.readonly" data-checklist-model="vm.fieldValue" data-checklist-value="item[vm.field_id]"/>{{item[vm.field_search]}}\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
