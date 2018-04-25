module.exports = {
  runTest: function(tools) {
    it('getData ', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      expect(YiiSoftApiService.getData({ data: 'Some data'})).toBe('Some data');

      //case
      expect(YiiSoftApiService.getData({})).toBe(undefined);

      //case
      expect(YiiSoftApiService.getData(null)).toBe(undefined);
    });
  }
};
