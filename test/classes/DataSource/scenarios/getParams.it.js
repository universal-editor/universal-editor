module.exports = {
  runTest: function(options) {
    it('method getParams', function() {
      let options, dataSource, result;
      options = {
        transport: {
          read: {
            params: (entity) => ({
              p1: 'v1',
              entity_id: 111
            })
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getParams('read').p1).toEqual('v1');
      expect(dataSource.getParams('read').entity_id).toEqual(111);
      expect($.isEmptyObject(dataSource.getParams('create'))).toBe(true);
    });
  }
};
