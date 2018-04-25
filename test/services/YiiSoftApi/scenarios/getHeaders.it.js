module.exports = {
  runTest: function(tools) {
    it('getHeaders', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      expect(YiiSoftApiService.getHeaders({ headers: 'Some data'})).toBe('Some data');

      //case
      expect(YiiSoftApiService.getHeaders({})).toBe(undefined);

      //case
      expect(JSON.stringify(YiiSoftApiService.getHeaders(null))).toBe('{}');
    });
  }
};
