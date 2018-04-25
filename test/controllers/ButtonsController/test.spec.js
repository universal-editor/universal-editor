import ToolsService from './../Tools.service';
describe('ButtonsController tests', function() {
  let tools = new ToolsService();

  beforeEach(angular.mock.module('universal-editor'));
  beforeEach(inject(function($injector, $templateCache) {
    tools.constructor($injector);

    //Get templates .jade.
    let templatesContext = require.context('./', true, /\.jade$/);
    templatesContext.keys().forEach(function(req) {
      let templateName = req.replace(/\.jade/, '.html').substr(2),
        htmlContent = templatesContext(req)();
      $templateCache.put(templateName, htmlContent);
    });
  }));

  let context = require.context('./scenarios', true, /\.it.js$/);
  context.keys().forEach((file) => context(file).runTest(tools));
});
