module.exports = {
  runTest: function(options) {
    it('default primaryKey', function() {
      let dataSource = new DataSource(options);
      expect(dataSource.primaryKey).toEqual('id');
    });
  }
};
