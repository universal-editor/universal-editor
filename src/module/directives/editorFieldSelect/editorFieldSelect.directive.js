(function () {
    'use strict';

    /**
     * @desc Select-type field.
     * @example <div editor-field-select=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldSelect',editorFieldSelect);

    editorFieldSelect.$inject = ['$templateCache', '$document'];

    function editorFieldSelect($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldSelect/editorFieldSelect.html'),
            controller: 'EditorFieldSelectController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            scope.isOpen = false;

            $document.on('click', function(event) {
                if (!elem[0].contains(event.target)) {
                    scope.$apply(function() {
                        scope.vm.showPossible = false;
                        scope.isOpen = false;
                        var formControl = elem.find('.select-input');
                        formControl.removeClass('active');
                        scope.vm.focusPossible(false);
                    });
                }
            });

            scope.toggleDropdown = function(e) {
                var dHeight = $(document).height();
                var dropdownHost = $(elem).find('.dropdown__host');
                var dropdownHeight = dropdownHost.height();
                var dropdownOffset = dropdownHost.offset();
                var dropdownBottom = dropdownOffset.top + dropdownHeight;
                if (dHeight - dropdownBottom < 500) {
                  $(elem).find('.dropdown__items').css('max-height', (dHeight - dropdownBottom) + 'px');
                } else {
                  $(elem).find('.dropdown__items').css('max-height', '');
                }
                scope.isOpen = !scope.isOpen;
                if (scope.isOpen) {
                    var formControl = elem.find('.select-input');
                    formControl.addClass('active');
                }
            };
        }
    }
})();