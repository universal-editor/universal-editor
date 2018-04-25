module.exports = {
  runTest: function(tools) {
    it('setPrefix', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration(),
        fact;

      //case
      fact = PaginationSettings.set('grid_id_1', uePagination.component.settings);
      PaginationSettings.setPrefix('grid_id_1', 'new_prefix');
      expect(PaginationSettings.get('grid_id_1').prefixGrid).toBe('new_prefix');
    });
  }
};
