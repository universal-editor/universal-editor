module.exports = {
  runTest: function(tools) {
    it('processResponse', function() {
      let YiiSoftApiService = tools.$injector.get('YiiSoftApiService');

      //case
      expect(YiiSoftApiService.processResponse({}, { data: 'data' })).toBe('data');

      //case
      let callbacks = {
        success: () => { },
        fail: () => { }
      },
        response = {
          status: 200,
          data: {},
        },
        config = {};
      spyOn(callbacks, 'success');
      spyOn(callbacks, 'fail');

      expect(YiiSoftApiService.processResponse(config, response, callbacks.success)).toBe(response.data);
      expect(callbacks.success).toHaveBeenCalledWith(response.data);

      //case
      response.status = 400;
      expect(YiiSoftApiService.processResponse(config, response, callbacks.success, callbacks.fail)).toBe(response.data);
      expect(callbacks.fail).toHaveBeenCalledWith(response);

      //case
      response.status = 500;
      expect(YiiSoftApiService.processResponse(config, response, callbacks.success, callbacks.fail)).toBe(response.data);
      expect(callbacks.fail).toHaveBeenCalledWith(response);

      //case
      response.status = -1; //if CORS
      expect(YiiSoftApiService.processResponse(config, response, callbacks.success, callbacks.fail)).toBe(response.data);
      expect(callbacks.fail).toHaveBeenCalledWith(response);
    });
  }
};
