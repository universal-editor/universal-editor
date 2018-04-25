module.exports = {
  runTest: function(tools) {
    it('getFilterController', function() {
      let gridSettings = tools.getUeGridConfiguration(),
       controller = tools.createController(gridSettings),
       FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage'),
       httpBackend = tools.$injector.get('$httpBackend');

       httpBackend.flush();
       expect(FilterFieldsStorage.getFilterController(gridSettings.component.$id).setting.component.name).toBe('ue-filter');
    });
  }
};
