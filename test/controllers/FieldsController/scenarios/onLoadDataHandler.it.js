module.exports = {
  runTest: function(tools) {
    it('onLoadDataHandler', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id');

      httpBackend.flush();
      ueDropdownComponent.onLoadDataHandler({}, {
        $componentId: '$form',
        categories_id: 3
      });

      expect(ueDropdownComponent.fieldValue).toBe(3);
    });
  }
};