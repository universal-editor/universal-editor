module.exports = {
  runTest: function(options) {

    it('setting url', function() {
      let dataSource = new DataSource(options);
      expect(dataSource.url).toEqual(options.transport.url);
    });

    it('method getURL', function() {
      let options, dataSource, result;

      // case 1
      options = {
        transport: {
          read: {
            url: '//universal-backend.dev/'
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getURL('read')).toEqual(options.transport.read.url);

      // case 2
      options = {
        transport: {
          read: {
            url: (a) => '//universal-backend.dev/' + a.postfix
          }
        }
      };
      dataSource = new DataSource(options);
      expect(dataSource.getURL('read', { postfix: 'list' })).toEqual('//universal-backend.dev/list');

      // case 3
      options = {
        transport: {
          read: {
            url: '//universal-backend.dev/:param1/:param2'
          }
        }
      };
      dataSource = new DataSource(options);
      result = dataSource.getURL('read', { param1: 'p1', param2: 'p2' });
      expect(result).toEqual('//universal-backend.dev/p1/p2');

      // case 4
      options = {
        primaryKey: 'primaryKey',
        transport: {
          url: '//universal-backend.dev'
        }
      };
      dataSource = new DataSource(options);
      result = dataSource.getURL('read');
      expect(result).toEqual('//universal-backend.dev');
      result = dataSource.getURL('create');
      expect(result).toEqual('//universal-backend.dev');
      result = dataSource.getURL('update', { primaryKey: '5' });
      expect(result).toEqual('//universal-backend.dev/5');
      result = dataSource.getURL('delete', { primaryKey: '5' });
      expect(result).toEqual('//universal-backend.dev/5');
    });
  }
};
