(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldTime/editorFieldTime.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-timepicker-wrapper input-group">\n' +
    '            <input name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-date-time="" data-format="HH:mm" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm timepicker"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <input name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-date-time="" data-format="HH:mm" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm timepicker"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
