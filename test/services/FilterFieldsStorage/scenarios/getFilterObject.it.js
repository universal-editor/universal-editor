module.exports = {
  runTest: function(tools) {
    it('getFilterObject', function() {
      let gridSettings = tools.getUeGridConfiguration(),
        controller = tools.createController(gridSettings),
        FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage'),
        httpBackend = tools.$injector.get('$httpBackend');

      FilterFieldsStorage.fillFilterComponent(gridSettings.component.$id, { "id": 5, "title": "Title1" });

      httpBackend.flush();
      expect(
        JSON.stringify(
          FilterFieldsStorage.getFilterObject(gridSettings.component.$id)
        )
      )
        .toBe('{"id":[{"operator":":value","value":5}],"title":[{"operator":"%:value%","value":"Title1"}]}');
    });
  }
};
