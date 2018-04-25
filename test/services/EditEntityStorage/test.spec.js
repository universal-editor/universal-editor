
import ToolsService from  './../Tools.service';
describe('EditEntityStorage tests', function() {
  let tools = new ToolsService();
  let httpBackend;

  beforeEach(angular.mock.module('universal-editor'));
  beforeEach(inject(function($injector, $httpBackend) {
    httpBackend = $httpBackend;
    tools.constructor($injector);
    httpBackend
      .when('GET', '/rest/v1/news/categories?page=1&per-page=50')
      .respond(require('./../../assets/categories.json'));
  }));

  let context = require.context('./scenarios',true,/\.it.js$/);
  context.keys().forEach((file)=>context(file).runTest(tools));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});
