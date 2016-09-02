(function($){
    $.ajax({
        url: '/assets/json/config.json',
        type: 'GET'
    }).done(function(data) {
        var editor = new UniversalEditor('universal-editor', data);
    });
})(jQuery);