
import ToolsService from  './../Tools.service';
describe('ApiService tests', function() {
  let tools = new ToolsService();
  let httpBackend;

  beforeEach(angular.mock.module('universal-editor'));
  beforeEach(inject(function($injector, $httpBackend) {
    httpBackend = $httpBackend;
    tools.constructor($injector);
    httpBackend
    .when('GET', '/rest/v1/news/categories?fields=id,title&page=1&per-page=30')
    .respond(require('./../../assets/categories.json'));
    httpBackend
    .when('GET', '/rest/v1/news/categories?fields=id,title&page=2&per-page=30')
    .respond(require('./../../assets/categories.page.2.json'));
    httpBackend
    .when('PUT', '/rest/v1/news/categories/35')
    .respond(require('./../../assets/update_answer.json'));
  }));

  let context = require.context('./scenarios',true,/\.it.js$/);
  context.keys().forEach((file)=>context(file).runTest(tools));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});
