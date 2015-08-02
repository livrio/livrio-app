angular.module("starter.directives",[])
.directive('book', function() {
    return {
        restrict: 'E',
        scope: {
            book: '=book'
        },
        controller: function($scope, $rootScope, BOOK) {

            $scope.user = $rootScope.user;

            $scope.onActionBook = function(event, item) {
                BOOK.menuAction(event, item);
            };
        },
        templateUrl: 'templates/directives/book.html'
    };
})
.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus(); 
      }, 150);
    }
  };
});

