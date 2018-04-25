

(function() {
  'use strict';
  describe('DataSource class tests', function() {
    let options = {
      standard: 'YiiSoft',
      sortBy: {
        id: 'desc'
      },
      parentField: 'parent_id',
      keys: {
        items: 'items',
        meta: '_meta'
      },
      transport: {
        url: '//universal-backend.dev/rest/v1/staff',
        read: {
          url: '//universal-backend.dev/rest/v1/staff',
          headers: function() {
            return {};
          },
          params: function() {
            return { expand: 'field', params: 'p' };
          },
          data: function() {
            return { data: 'field' };
          },
          method: 'GET',
          handlers: {
            before: function(config, e) {
              console.log('Before handler!');
            },
            error: function(reject) {
              console.log('Error handler!');
            },
            success: function(response) {
              console.log('Success handler!');
            },
            complete: function() {
              console.log('Complete handler!');
            }
          }
        },
        one: {
          url: '//universal-backend.dev/rest/v1/staff/:id',
          headers: function() {
            return {};
          },
          params: function() {
            return { expand: 'field', params: 'p' };
          },
          data: function() {
            return { data: 'field' };
          },
          method: 'GET',
          handlers: {
            before: function(config) {
              console.log('Before handler!');
            },
            error: function(reject) {
              console.log('Error handler!');
            },
            success: function(response) {
              console.log('Success handler!');
            },
            complete: function() {
              console.log('Complete handler!');
            }
          }
        }
      },

      fields: [
        {
          name: 'name',
          component: {
            name: 'ue-string',
            settings: {
              label: 'Name'
            }
          }
        }
      ]
    };
    let context = require.context('./scenarios', true, /\.it.js$/);
    context.keys().forEach((file) => context(file).runTest(options));
  });
})();
