module.exports = {
  runTest: function(tools) {
    it('getURL', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      expect(YiiSoftApiService.getURL({ url: 'http://localhost'})).toBe('http://localhost');

      //case
      expect(YiiSoftApiService.getURL(null)).toBe(undefined);
    });
  }
};
