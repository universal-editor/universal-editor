module.exports = {
  runTest: function(tools) {
    it('registerFilterController and then addFilterFieldController', function() {
      let gridSettings = tools.getUeGridConfiguration(),
       controller = tools.createController(gridSettings),
       FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage'),
       httpBackend = tools.$injector.get('$httpBackend');
       httpBackend.flush();
      //case
      expect(FilterFieldsStorage.getFilterFieldController(gridSettings.component.$id).length).toBe(gridSettings.component.settings.dataSource.fields.length);

      //case
      controller.$destroy();
      expect(FilterFieldsStorage.getFilterFieldController(gridSettings.component.$id).length).toBe(0);
    });
  }
};
