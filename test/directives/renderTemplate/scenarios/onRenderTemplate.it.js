module.exports = {
  runTest: function(tools) {
    it('Test empty template', function() {
      let ueStringSettings = {
        component: {
          name: 'ue-string',
          settings: {
            mode: 'preview',
            templates: {
            }
          }
        }
      },
      scopeUeString = tools.createElement(ueStringSettings);
      expect(scopeUeString.find('#custom_template_component').length).toBe(0);
    });
  }
};
