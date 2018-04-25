module.exports = {
  runTest: function(tools) {
    it('getMethod', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      expect(YiiSoftApiService.getMethod({ method: 'GET'})).toBe('GET');

      //case
      expect(YiiSoftApiService.getMethod({ action: 'create' })).toBe('POST');

      //case
      expect(YiiSoftApiService.getMethod({ action: 'update' })).toBe('PUT');

      //case
      expect(YiiSoftApiService.getMethod({ action: 'delete' })).toBe('DELETE');

      //case
      expect(YiiSoftApiService.getMethod({ action: 'read' })).toBe('GET');

      //case
      expect(YiiSoftApiService.getMethod({ action: 'one' })).toBe('GET');
    });
  }
};
