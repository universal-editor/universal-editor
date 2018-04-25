
import ToolsService from  './../Tools.service';
describe('FilterFieldsStorage tests', function() {
  let tools = new ToolsService(), httpBackend;

  beforeEach(angular.mock.module('universal-editor'));
  beforeEach(inject(function($injector, $location, $httpBackend) {
    httpBackend = $httpBackend;
    tools.constructor($injector);
    $location.search('prefix-filter', '{"title":"Title"}');
    httpBackend
    .when('GET', '/rest/v1/news/categories?fields=id,title&page=1&per-page=30')
    .respond(
      require('./../../assets/categories.json')
    );
  }));

  let context = require.context('./scenarios',true,/\.it.js$/);
  context.keys().forEach((file)=>context(file).runTest(tools));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});
