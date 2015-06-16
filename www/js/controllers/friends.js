angular.module("starter.controllers")

.controller("friendsCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, settings) {
    $scope.friends = [];


    $scope.onRefresh = function() {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.FRIEND)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                $scope.friends = [];
                angular.forEach(response.data, function(item) {
                    if (!item.photo) {
                        item.photo = "img/avatar.png?";
                    }
                    else {
                        item.photo =  "http://api.livr.io/photo/" + item.photo;
                    }
                    $scope.friends.push(item);
                });
            }
        })
        .error(function() {
            $ionicLoading.hide();
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
