/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
function UniversalEditor(id, config) {
    'use strict';

    var app = angular.module('universal.editor');
    var configData = config;
    var unEditor = $('#' + id);
    unEditor.append("<div data-ui-view=''></div>");
    app.constant('configData', config);
    angular.bootstrap(unEditor[0], ["unEditor"]);
}