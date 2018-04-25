module.exports = {
  runTest: function(tools) {
    it('updateComponents', function() {
      let formSettings = tools.getUeFormConfiguration2(),
        controller = tools.createController(formSettings),
        EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        $rootScope = tools.$injector.get('$rootScope'),
        expectedObject;
        $rootScope.$on('ue:componentValueChanged', function(event) {
          expectedObject = event;
        })
        EditEntityStorage.updateComponents(formSettings.component.$id);

        // gets value of the form and compares with argument of 'ue:componentValueChanged'-event
        let eventObj = EditEntityStorage.constructOutputValue({ $componentId: formSettings.component.$id }, true);
        eventObj.$componentId = formSettings.component.$id;
        expect(expectedObject.name).toBe('ue:componentValueChanged');
    });
  }
};
