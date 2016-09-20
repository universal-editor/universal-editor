(function () {
    'use strict';

    /**
     * @desc Select-type field.
     * @example <ue-select></ue-select>
     */
    angular
        .module('universal.editor')
        .directive('ueSelect',ueSelect);

    ueSelect.$inject = ['$templateCache', '$document'];

    function ueSelect($templateCache, $document){
        return {
            restrict : 'E',
            replace : true,
            scope : {
                field: "=",
                setError: "=",
                setErrorEmpty: "=",
                errorIndexOf: "=",
                parentField: "=",
                parentFieldIndex: "="
            },
            template : $templateCache.get('module/directives/ueSelect/ueSelect.html'),
            controller: 'UeSelectController',
            controllerAs : 'vm',
            link : link,
            bindToController: true
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
                scope.vm.setColorPlaceholder();
            };
        }
    }
})();