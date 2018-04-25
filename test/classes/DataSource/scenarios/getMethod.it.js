module.exports = {
  runTest: function() {
    it('method getMethod', function() {
      let options, dataSource, result;
      options = {
        transport: {
          read: {
            method: 'GET'
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getMethod('read')).toEqual('GET');

      options = {
        transport: {
          read: {},
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getMethod('read')).toEqual('GET');
      expect(dataSource.getMethod('create')).toEqual('POST');
      expect(dataSource.getMethod('update')).toEqual('PUT');
      expect(dataSource.getMethod('delete')).toEqual('DELETE');
    });
  }
};
