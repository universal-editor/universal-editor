(function() {
  'use strict';

  angular
    .module('universal-editor',
      [
        'universal-editor.templates',
        'minicolors',
        'checklist-model',
        'angularMoment',
        'ngCookies',
        'ui.router',
        'ui.mask',
        'toastr',
        'pascalprecht.translate',
        'ui.bootstrap',
        'dndLists'
      ])
    .run(universalEditorRun)
    .config(universalEditorConfig);

  function universalEditorConfig(minicolorsProvider, $httpProvider) {
    'ngInject';

    angular.extend(minicolorsProvider.defaults, {
      control: 'hue',
      position: 'top left',
      letterCase: 'uppercase'
    });

    $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data) {
      if (data === undefined) {
        return data;
      }
      return $.param(data);
    };
    $httpProvider.interceptors.push('EditorHttpInterceptor');
  }


  function universalEditorRun($rootScope, $location, FilterFieldsStorage, ApiService) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

    function onStateChangeStart(event, toState, toParams, fromState, fromParams, options) {
      FilterFieldsStorage.filterSearchString = !options.reload ? $location.search() : {};
    }

    function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      if (FilterFieldsStorage.filterSearchString) {
        $location.search(FilterFieldsStorage.filterSearchString);
      }
      ApiService.alreadyRequested.length = 0;
    }
  }
})();
