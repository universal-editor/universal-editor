module.exports = {
  runTest: function(tools) {
    it('Preview-template', function() {
      let ueStringSettings = {
        component: {
          name: 'ue-string',
          settings: {
            mode: 'preview',
            templates: {
              preview: function() {
                return '<p id="custom_template_component">{{vm.previewValue}}</p>'
              }
            }
          }
        }
      }, scopeUeString = tools.createElement(ueStringSettings);
      expect(scopeUeString.find('.component-preview #custom_template_component').length).toBe(1);
    });
  }
};
