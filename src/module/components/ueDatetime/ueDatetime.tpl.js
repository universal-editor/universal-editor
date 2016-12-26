(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueDatetime/ueDatetime.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-wrapper-field\': vm.options.filter}">\n' +
    '    <div on-render-template="on-render-template" ng-class="{\'component-filter\': vm.options.filter,                   \'component-edit\': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === \'edit\',                   \'component-preview\': vm.templates.preview &amp;&amp; vm.regim === \'preview\'}" class="component-template"></div>\n' +
    '    <div ng-if="((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === \'edit\'" ng-class="{\'component-filter\': vm.options.filter}" class="component-edit"> \n' +
    '        <label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '            <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '                <div ng-bind="::vm.hint" class="hint-text"></div>\n' +
    '            </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="::vm.label"></span>\n' +
    '        </label>\n' +
    '        <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}" ng-style="{\'overflow:auto\':vm.multiple}"> \n' +
    '            <div data-ng-if="vm.multiple" ng-class="{\'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left\': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}">\n' +
    '                <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-datepicker-wrapper input-group">\n' +
    '                    <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue[$index]" view="date" format="{{vm.format || \'YYYY-MM-DD HH:mm:ss\'}}" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" data-min-date="minDate" data-max-date="maxDate" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                        <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '                </div>\n' +
    '                <div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.multiple" ng-class="{\'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left\': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}">\n' +
    '                <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue" view="date" format="{{vm.format || \'YYYY-MM-DD HH:mm:ss\'}}" data-ng-blur="vm.inputLeave(vm.fieldValue)" data-min-date="minDate" data-max-date="maxDate" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.templates.preview &amp;&amp; vm.regim === \'preview\'" class="component-preview"> \n' +
    '        <div data-ng-show="vm.loadingData" class="loader-search-wrapper">\n' +
    '            <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '        </div><span ng-bind="::vm.previewValue" data-ng-show="!vm.loadingData" ng-if="!vm.multiple"></span>\n' +
    '        <div ng-repeat="value in vm.previewValue track by $index" data-ng-show="!vm.loadingData" ng-if="vm.multiple"><span ng-bind="value"></span></div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
