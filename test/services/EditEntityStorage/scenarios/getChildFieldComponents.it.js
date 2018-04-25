module.exports = {
  runTest: function(tools) {
    it('getChildFieldComponents and than deleteFieldController', function() {
      let formSettings = tools.getUeFormConfiguration(),
        controller = tools.createController(formSettings),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend');


      /** Check that 4 components at the form (ue-autocomplete, ue-button, ue-button, ue-button)*/
      expect(EditEntityStorage.getChildFieldComponents('form').length).toBe(4);

      /** Destroy components*/
      controller.$destroy();
      expect(EditEntityStorage.getChildFieldComponents('form').length).toBe(0);
      httpBackend.flush();
    });
  }
};
