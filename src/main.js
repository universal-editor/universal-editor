require('./module/templates.module.js');
require('./module/universal-editor.module.js');
require('./module/localization.configFile.js');
var context = require.context('./module', true, /\.js$/);
context.keys().forEach(context);
require('expose?UniversalEditor!exports?UniversalEditor!./module/universal-editor.js');

if (INCLUDE_VENDOR) {
  require('./vendor.scss');
} else {
  require('./index.scss');
}
if (NODE_ENV !== 'production' || RUNNING_SERVER) {
  require('./config.js');
}