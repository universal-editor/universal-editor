(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldDatetime/editorFieldDatetime.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-2 col-xs-2">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-datepicker-wrapper input-group">\n' +
    '            <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue[$index]" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-2 col-xs-2">\n' +
    '        <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
