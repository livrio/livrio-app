angular.module("livrio.controllers")

.controller("book_ctrl", function($scope, $rootScope, $filter, $ionicModal, BOOK, SHELF) {

    var trans = $filter('translate');

    $scope.librarys = [];

    $scope.loading = true;

    $scope.hasScroll = false;

    $scope.empty_list = trans('book.empty_list');

    var page = 1;

    $scope.onRefresh = function(reset) {

        if (reset) {
            page=1;
        }

        BOOK.all({
            page: page
        }).then(function(books) {
            if (reset) {
                $scope.librarys = [];
                $scope.loading = true;
            }
            if (books.length >= 20) {
                $scope.hasScroll = true;
            }
            else {
                $scope.hasScroll = false;
            }

            angular.forEach(books, function(v) {
                $scope.librarys.push(v);
            });

            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.loading = false;
        });
    };

    $scope.onRefresh(true);

    $rootScope.$on("book.refresh",function() {
        $scope.onRefresh(true);
    });


    $scope.loadMore = function() {
        console.log('loadMore');
        page++;
        $scope.onRefresh();
    };

});
