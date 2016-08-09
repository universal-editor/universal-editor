(function($){
    'use strict';

    var app = angular.module('universal.editor');

    $(document).ready(function(){
        var http = angular.injector(['ng']).get('$http');
        var unEditor = $('#universal-editor');
        var url = unEditor[0].getAttribute('data-config-url');
        unEditor.append("<div data-ui-view=''></div>");
        if (url !== null){
            http({
                method : "GET",
                url : url
            }).then(function (response) {
                app.constant('configData', response.data);
                angular.bootstrap(unEditor[0], ["unEditor"]);
                console.info("Config file successfuly loaded from API. Using remote config file from: "+ url);
            }, function (reject) {
                angular.bootstrap(unEditor[0], ["unEditor"]);
                console.warn("Config file load error. Using local config file data.");
            });
        } else {
            angular.bootstrap(unEditor[0], ["unEditor"]);
            console.warn("Config file url not presented. Using local config file data.");
        }
    });
})(jQuery);