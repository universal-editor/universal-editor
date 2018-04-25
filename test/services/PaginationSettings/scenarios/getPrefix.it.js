module.exports = {
  runTest: function(tools) {
    it('getPrefix', function() {
      let PaginationSettings = tools.$injector.get('PaginationSettings'),
        uePagination = tools.getUePaginationConfiguration();

      //case
      PaginationSettings.set('grid_id_1', uePagination.component.settings, 'prefix');
      expect(PaginationSettings.getPrefix('grid_id_1')).toBe('prefix');
    });
  }
};
