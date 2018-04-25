require('./index.scss');
if (IS_DEV) {
  require('./bootstrap-inject.scss');
}
require('./module/templates.module.js');
require('./module/universal-editor.module.js');
require('./module/localization.configFile.js');
var context = require.context('./module', true, /\.js$/);
context.keys().forEach(function (file) {
  if(!/\.spec\.js$/.test(file)) {
    context(file);
  }
});
