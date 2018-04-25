module.exports = {
  runTest: function(tools) {
    it('checkForEmptyValue', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        httpBackend = tools.$injector.get('$httpBackend'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithTwoFields(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueDropdownComponent = EditEntityStorage.getComponentBySetting('$categories_id');

      let emptyVvalue = {
        m: null,
        n: {
          a: '',
          b: undefined
        }
      };

      let notEmptyValue = {
        m: null,
        n: {
          a: 'value',
          b: undefined
        }
      };

      httpBackend.flush();

      expect(ueDropdownComponent.checkForEmptyValue(emptyVvalue)).toBe(false);
      expect(ueDropdownComponent.checkForEmptyValue(notEmptyValue)).toBe(true);
    });
  }
};