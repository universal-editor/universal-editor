module.exports = {
  runTest: function() {
    it('method getData', function() {
      let options, dataSource, result;
      options = {
        transport: {
          read: {
            data: (entity) => ({
              p1: 'v1',
              entity_id: 111
            })
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getData('read').p1).toEqual('v1');
      expect(dataSource.getData('read').entity_id).toEqual(111);
      expect($.isEmptyObject(dataSource.getData('create'))).toBe(true);
    });
  }
};
