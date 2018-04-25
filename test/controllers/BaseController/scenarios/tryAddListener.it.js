module.exports = {
  runTest: function(tools) {
    it('tryAddListener', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueFormSettings = tools.getDefaultUeFormSettingsWithOneField(),
        scopeUeForm = tools.createController(ueFormSettings),
        ueStringComponent = EditEntityStorage.getComponentBySetting('$fio'),
        testFunction = () => { };

      // Try add test-function as listener of the component
      ueStringComponent.tryAddListener(testFunction);

      expect(ueStringComponent.listeners.pop()).toBe(testFunction);
    });
  }
};