module.exports = {
  runTest: function(tools) {
    it('constructOutputValue', function() {
      let formSettings = tools.getUeFormConfiguration2(),
        controller = tools.createController(formSettings),
        EditEntityStorage = tools.$injector.get('EditEntityStorage');

      expect(
        JSON.stringify(
          EditEntityStorage.constructOutputValue(
            {
              $componentId: formSettings.component.$id
            }
          )
        )
      )
      .toBe(
        JSON.stringify(
          {
            string: {
              field: 'value'
            },
            list: 1
          }
        )
      );
    });
  }
};
