angular.module("starter.controllers")

.controller("libraryFriendCtrl", function($scope, $ionicHistory, $stateParams, $rootScope, $http, $ionicPopup, $ionicLoading, settings) {

    $scope.librarys = [];

    var id = $stateParams.id;


    $scope.onRefresh = function() {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.BOOK + "?friend=" + id)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                $scope.librarys = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author.join(", ");
                    if (!item.thumb) {
                        item.thumb = "img/cover.gif?";
                    }
                    $scope.librarys.push(item);
                });
            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.log("TRATAR ERROR");
        });
    };


    $scope.onOpen = function(item) {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.BOOK + "/" + item.id)
        .success(function(response) {
            $ionicLoading.hide();
            $rootScope.bookView = response.data;
            window.location = "#/library-view/" + item.id;
        })
        .error(function() {
            $ionicLoading.hide();
        });
    };

    $scope.onRefresh();


    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

});
