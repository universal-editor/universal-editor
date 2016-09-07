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
                        scope.vm.isBlur();
                    });

                }
            });

            scope.toggleDropdown = function() {
                elem.find('input')[0].focus();
                var dHeight = $(document).height();
                var dropdownHost = $(elem).find('.dropdown__host');
                var dropdownHeight = dropdownHost.height();
                var dropdownOffset = dropdownHost.offset();
                var dropdownBottom = dropdownOffset.top + dropdownHeight;
                elem.find('.dropdown__items').removeClass('dropdown-top');
                elem.find('.dropdown__items').removeClass('dropdown-bottom');
                if (dHeight - dropdownBottom < 300) {
                    elem.find('.dropdown__items').addClass('dropdown-top');
                } else {
                    elem.find('.dropdown__items').addClass('dropdown-bottom');
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