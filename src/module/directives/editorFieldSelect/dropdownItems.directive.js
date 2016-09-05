(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('dropdownItems',dropdownItems);

    dropdownItems.$inject = ['$templateCache', '$document', '$compile'];

    function dropdownItems($templateCache, $document, $compile) {
        return {
            restrict : 'A',
            replace : true,
            scope : {
                options: '=',
                isOpen: '=',
                fieldSearch: '=',
                childCountField: '=',
                onToggle: '=',
                api: '=',
                selectBranches: '=',
                assetsPath: '=',
                multiple: '=',
                activeElement: '=',
                setActiveElement: '='
            },
            template : $templateCache.get('module/directives/editorFieldSelect/dropdownItems.html'),
            controller: 'DropdownItemsController',
            controllerAs : 'vm',
            compile : compile
        };

        function compile(element, link) {
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            }
        }

        function link(scope, elem, attrs, ctrl){
            // elem.on('$destroy', function () {
            //     scope.$destroy();
            // });
            //
            // scope.isOpen = false;
            //
            // $document.on('click', function() {
            //     scope.isOpen = false;
            // });
            //
            // scope.toggleDropdown = function(e) {
            //     scope.isOpen = !scope.isOpen;
            //     e.stopPropagation();
            // };
        }
    }
})();