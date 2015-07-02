angular.module("starter.controllers")

.controller("libraryFriendCtrl", function($scope, $ionicNavBarDelegate, $ionicHistory, $stateParams, $rootScope, $http, $ionicPopup, $ionicLoading, FRIEND, BOOK, settings) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    FRIEND.view(id)
    .then(function(friend) {
        $scope.friend = friend;
        console.log(friend);
        $ionicNavBarDelegate.title(friend.fullname);
        $scope.onRefresh();
    });

    $scope.onRefresh = function() {
        BOOK.all({
            friend: id
        })
        .then(function(data) {
            var library = [];
            angular.forEach(data, function(item) {
                item.author = item.author[0];//.author.join(", ");
                item.friend = true;
                library.push(item);
            });

            $scope.librarys = library;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };

});
