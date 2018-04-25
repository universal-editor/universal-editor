module.exports = {
  runTest: function(tools) {
    it('request', function() {
      let EditorHttpInterceptor = tools.$injector.get('EditorHttpInterceptor'),
        fact;

      //case
      fact = EditorHttpInterceptor.request({
        beforeSend: () => true
      });
      expect(fact.timeout.$$state.status).toBe(0);

      //case
      fact = EditorHttpInterceptor.request({
        beforeSendButton: () => false
      });
      expect(fact.timeout.$$state.status).toBe(1);
      expect(fact.canceled).toBe(true);

      //case
      fact = EditorHttpInterceptor.request({
        beforeSend: () => false
      });
      expect(fact.timeout.$$state.status).toBe(1);
      expect(fact.canceled).toBe(true);
    });
  }
};
