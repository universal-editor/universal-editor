require('./module/templates.module.js');
require('./module/universal-editor.module.js');
require('./module/localization.configFile.js');
var context = require.context('./module', true, 
          /\.js$/);
context.keys().forEach(context);
require('expose?UniversalEditor!exports?UniversalEditor!./module/universal-editor.js');
require('./index.scss');
require('./config.js');