require('./index.scss');
require('./bootstrap-inject.scss');
require('./module/templates.module.js');
require('./module/universal-editor.module.js');
require('./module/localization.configFile.js');
require('./JSONAPIService/JSONAPIService.service.js');
var context = require.context('./module', true, /\.js$/);
context.keys().forEach(context);
