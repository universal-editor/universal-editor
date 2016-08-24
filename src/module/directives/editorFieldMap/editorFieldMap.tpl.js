(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldMap/editorFieldMap.html',
    '\n' +
    '<div>\n' +
    '    <div class="field-map-wrapper col-lg-6 col-md-6 col-sm-7 col-xs-8">\n' +
    '        <ya-map data-ya-center="{{vm.mapParam.center}}" data-ya-zoom="{{vm.mapParam.zoom}}" data-ya-after-init="vm.afterInit($target)" data-ya-event-dblclick="vm.mapDoubleClick($event)" data-ya-controls="zoomControl searchControl fullscreenControl" data-ya-behaviors="scrollZoom multiTouch drag" style="width: {{vm.mapParam.width}}px; height: {{vm.mapParam.height}}px; display: block;">\n' +
    '            <ya-geo-object data-ng-if="!vm.multiple &amp;&amp; vm.fieldValue" data-ya-source="{geometry:{type : \'Point\', coordinates : vm.fieldValue}}"></ya-geo-object>\n' +
    '            <ya-geo-object data-ng-if="vm.multiple" data-ng-repeat="mark in vm.fieldValue track by $index" data-ya-source="{geometry:{type : \'Point\', coordinates : mark}, properties : { iconContent : $index + 1 }}"></ya-geo-object>\n' +
    '        </ya-map>\n' +
    '        <div class="field-map-values">\n' +
    '            <div data-ng-if="vm.multiple" data-ng-repeat="item in vm.fieldValue track by $index" class="item-map-wrapper">\n' +
    '                <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly &amp;&amp; vm.fieldValue.length" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE_MARK\' | translate}} {{$index + 1}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.multiple" class="item-map-wrapper">\n' +
    '                <div data-ng-click="vm.removeItem()" data-ng-if="!vm.readonly &amp;&amp; vm.fieldValue" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE_MARK\' | translate}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
