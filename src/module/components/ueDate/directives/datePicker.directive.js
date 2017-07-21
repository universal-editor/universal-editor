(function() {
  'use strict';

  angular
    .module('universal-editor')
    .directive('datePicker', function() {
      return {
        require: 'ngModel',
        scope: {
          format: '@',
          locale: '@',
          maxDate: '@',
          minDate: '@',
          view: '@'
        },
        link: function(scope, element, attr, ngModel) {
          var views = {
            year: 'years',
            month: 'months',
            date: 'days',
            hours: 'days',
            minutes: 'days'
          };
          $(element).datetimepicker({
            locale: scope.locale || moment.locale().toUpperCase(),
            format: scope.format,
            maxDate: scope.maxDate ? moment(scope.maxDate, scope.format) : false,
            minDate: scope.minDate ? moment(scope.minDate, scope.format) : false,
            viewMode: scope.view ? views[scope.view] : 'days'
          });

          $(element).on("dp.change", function(e) {
            var date = moment(e.date, scope.format);
            ngModel.$viewValue = date.isValid() ? moment(e.date, scope.format).format(scope.format) : moment(Date.now()).format(scope.format);
            ngModel.$commitViewValue();
          });
        }
      };
    });
})();
