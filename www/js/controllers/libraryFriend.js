angular.module("starter.controllers")

.controller("libraryFriendCtrl", function($scope, $ionicNavBarDelegate, $ionicHistory, $stateParams, $rootScope, $http, $ionicPopup, $ionicLoading, FRIEND, BOOK, settings) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    $scope.friend = {};

    FRIEND.view(id)
    .then(function(friend) {
        $scope.friend = friend;
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
