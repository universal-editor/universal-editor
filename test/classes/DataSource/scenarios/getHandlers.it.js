module.exports = {
  runTest: function() {
    it('method getHandlers', function() {
      let options, dataSource, result;

      options = {
        transport: {
          read: {
            handlers: {
              before: () => 'beforeHnadler'
            }
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getHandlers('read').before()).toEqual('beforeHnadler');
    });
  }
};
