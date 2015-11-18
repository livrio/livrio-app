angular.module('livrio.controllers')

.controller('book_view_ctrl', function($scope, $rootScope, $stateParams, BOOK) {

    var id = $stateParams.id;

    $scope.loading = true;
    var book;
    BOOK.view(id)
    .then(function(data) {
        $scope.loading = false;
        book = $rootScope.bookView = data;
    });


    $scope.onLike = function(book) {
        BOOK.like(book)
        .then(function(data) {
            $rootScope.bookView = data;
        });
    }

});
