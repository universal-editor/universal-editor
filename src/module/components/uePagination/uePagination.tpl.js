(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/uePagination/uePagination.html',
    '\n' +
    '<div>\n' +
    '    <ul class="pagination col-lg-10 col-md-10 col-sm-10 col-xs-10">\n' +
    '        <li data-ng-repeat="pageItem in vm.pageItemsArray" data-ng-class="pageItem.self ? \'active\' : \'\'"><a data-ng-if="!pageItem.self" href="{{pageItem.href}}" data-ng-click="vm.changePage($event,pageItem.href)">{{pageItem.label}}</a><span data-ng-if="pageItem.self">{{pageItem.label}}</span></li>\n' +
    '    </ul>\n' +
    '    <div dana-ng-if="vm.metaKey" class="meta-info col-lg-2 col-md-2 col-sm-2 col-xs-2">{{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}</div>\n' +
    '</div>');
}]);
})();
