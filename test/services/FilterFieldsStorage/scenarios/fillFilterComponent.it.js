module.exports = {
  runTest: function(tools) {
    it('fillFilterComponent', function() {
      let gridSettings = tools.getExtendedUeGridConfiguration(),
        controller = tools.createController(gridSettings),
        FilterFieldsStorage = tools.$injector.get('FilterFieldsStorage');

      //case
      FilterFieldsStorage.fillFilterComponent(gridSettings.component.$id, {
        'id': 5,
        'title':'%Title1%',
        '>=created': '12.01.2007',
        '<=created': '12.01.2012',
        type: 'v1',
        fired: 0
      });
      expect(
        JSON.stringify(
          FilterFieldsStorage.calculate(
            gridSettings.component.$id,
            gridSettings.component.settings.routing.paramsPrefix
          )
        )
      )
        .toBe('{"id":5,"title":"%Title1%","type":"v1","fired":0,">=created":"12.01.2007","<=created":"12.01.2012"}');

      //case
      expect(
        JSON.stringify(
          FilterFieldsStorage.getFilterQueryObject(
            gridSettings.component.settings.routing.paramsPrefix
          )
        )
      )
        .toBe('{"id":5,"title":"%Title1%","type":"v1","fired":0,">=created":"12.01.2007","<=created":"12.01.2012"}');
    });
  }
};

