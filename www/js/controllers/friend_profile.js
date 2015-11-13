angular.module("livrio.controllers")

.controller("friend_profile_ctrl", function($scope, $ionicNavBarDelegate, $stateParams, $filter, FRIEND, BOOK) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    $scope.friend = {};

    $scope.hasScroll = false;

    var page = 1;

    var trans = $filter('translate');

    $scope.empty_list = trans('friend_profile.empty_list_book');

    FRIEND.view(id)
    .then(function(friend) {
        $scope.friend = friend;

        $scope.cover = {
            'background-image': 'url(' + friend.cover + ')'
        };
        $scope.photo = {
            'background-image': 'url(' + friend.photo + ')'
        };
        $ionicNavBarDelegate.title(friend.fullname);
        $scope.onRefresh(true);
    });

    $scope.onRefresh = function(reset) {

        if (reset) {
            page=1;
        }

        BOOK.all({
            page: page,
            friend: id
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

    $scope.loadMore = function() {
        page++;
        $scope.onRefresh();
    };
});
