module.exports = {
  runTest: function(tools) {
    it('isFilterSearchParamEmpty', function() {
      let gridSettings = tools.getExtendedUeGridConfiguration(),
       controller = tools.createController(gridSettings),
       FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage');

       expect(FilterFieldsStorage.isFilterSearchParamEmpty(gridSettings.component.settings.routing.paramsPrefix)).toBe(false);
    });
  }
};
