angular.module("starter.controllers")

.controller("friendsCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, settings) {
    $scope.friends = [];

    $scope.loading = true;
    $scope.onRefresh = function() {
        $http.get(settings.URL.FRIEND)
        .success(function(response) {
            if (!response.errors) {
                $scope.friends = [];
                angular.forEach(response.data, function(item) {
                    $scope.friends.push(item);
                });
                $scope.loading = false;
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
    };

    $scope.onLibrary = function(item) {
        $rootScope.friend = item;
        window.location = "#/library-friend/" + item.id;
    };

    $scope.onRefresh();


    $rootScope.$on("friend.refresh",function() {
        $scope.onRefresh();
    });

});
