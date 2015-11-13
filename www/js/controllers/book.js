angular.module("livrio.controllers")

.controller("book_ctrl", function($scope, $rootScope, $filter, $ionicModal, BOOK, SHELF) {

    var trans = $filter('translate');

    $scope.librarys = [];

    $scope.loading = true;

    $scope.empty_list = trans('book.empty_list');

    $scope.onRefresh = function() {
        BOOK.all().then(function(books) {
            $scope.librarys = books;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loading = false;
        });
    };

    $scope.onRefresh();

    $rootScope.$on("book.refresh",function() {
        $scope.onRefresh();
    });

});
