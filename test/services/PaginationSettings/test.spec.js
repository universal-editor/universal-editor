
import ToolsService from  './../Tools.service';
describe('PaginationSettings tests', function() {
  let tools = new ToolsService();
  let httpBackend;

  beforeEach(angular.mock.module('universal-editor'));
  beforeEach(inject(function($injector, $httpBackend) {
    httpBackend = $httpBackend;
    tools.constructor($injector);
  }));

  let context = require.context('./scenarios',true,/\.it.js$/);
  context.keys().forEach((file)=>context(file).runTest(tools));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});
