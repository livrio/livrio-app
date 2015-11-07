angular.module("starter.controllers")

.controller("libraryFriendCtrl", function($scope, $ionicNavBarDelegate, $ionicHistory, $stateParams, $rootScope, $http, $ionicPopup, $filter, $ionicLoading, FRIEND, BOOK, settings) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    $scope.friend = {};

    var trans = $filter('translate');

    $scope.empty_list = trans('friends.empty_list_book');

    FRIEND.view(id)
    .then(function(friend) {
        $scope.friend = friend;

        $scope.cover = {
            'background-image': 'url(' + friend.cover + ')'
        };
        $scope.photo = {
            'background-image': 'url(' + friend.photo + ')'
        };
        console.log(friend.fullname);
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


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };

});
