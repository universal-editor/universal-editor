module.exports = {
  runTest: function(tools) {
    it('Setting of the template as html-string', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueButtonsSettings = {
          $id: 'btn_1',
          component: {
            name: 'ue-button',
            settings: {
              label: 'Button',
              template: '<button id="btn_custom">{{vm.label}}</button>'
            }
          }
        },
        elementUeButton = tools.createElement(ueButtonsSettings),
        ueButtonComponent = EditEntityStorage.getComponentBySetting('btn_1');

        expect(elementUeButton.find('#btn_custom').length).toBe(1);
    });

    it('Setting of the template as html-file', function() {
      let EditEntityStorage = tools.$injector.get('EditEntityStorage'),
        ueButtonsSettings = {
          $id: 'btn_1',
          component: {
            name: 'ue-button',
            settings: {
              label: 'Button',
              template: 'templates/btn_template.html'
            }
          }
        },
        elementUeButton = tools.createElement(ueButtonsSettings),
        ueButtonComponent = EditEntityStorage.getComponentBySetting('btn_1');

        expect(elementUeButton.find('#btn_custom').length).toBe(1);
    });
  }
};
