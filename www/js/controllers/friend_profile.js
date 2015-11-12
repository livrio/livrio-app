angular.module("livrio.controllers")

.controller("friend_profile_ctrl", function($scope, $ionicNavBarDelegate, $stateParams, $filter, FRIEND, BOOK) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    $scope.friend = {};

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
        $scope.onRefresh();
    });

    $scope.onRefresh = function() {
        BOOK.all({
            friend: id
        })
        .then(function(data) {
            $scope.librarys = data;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
});
