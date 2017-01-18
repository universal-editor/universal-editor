var angular_, angularOut;
angular_ = angularOut = $(window).prop('angular');
window.angular = null;

require('jquery-minicolors');
require('angularjs');

module.exports = window.angular;
require('moment-timezone/builds/moment-timezone-with-data-2010-2020.js');
require('angular-moment/angular-moment.js');
require('angular-cookies/angular-cookies.js');
require('angular-datepicker/dist/angular-datepicker.js');
require('checklist-model/checklist-model.js');
require('angular-toastr/dist/angular-toastr.tpls.js');

require('angular-translate/angular-translate.js');
require('angular-translate-loader-static-files/angular-translate-loader-static-files.js');

require('angular-ui-router/release/angular-ui-router.js');
require('angular-ui-mask/dist/mask.js');

require('ng-file-upload/ng-file-upload.js');
require('ng-file-upload-shim/ng-file-upload-shim.js');

require('angular-minicolors/angular-minicolors.js');

require('bootstrap/dist/js/bootstrap.js');
require('angular-bootstrap/ui-bootstrap-tpls.js');

$(window).prop('angular', angular_);
window.angular = angularOut;
