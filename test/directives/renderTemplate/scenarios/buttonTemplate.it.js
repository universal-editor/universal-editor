module.exports = {
  runTest: function(tools) {
    it('Test template for ue-button', function() {
      let ueButtonSettings = {
        component: {
          name: 'ue-button',
          settings: {
            template: '<button id="custom_template_component"></button>'
          }
        }
      },
      scopeUeButton = tools.createElement(ueButtonSettings);
      expect(scopeUeButton.find('.button-template #custom_template_component').length).toBe(1);
    });
  }
};
