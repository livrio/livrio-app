angular.module("starter.controllers")

.controller("libraryFriendCtrl", function($scope, $ionicHistory, $stateParams, $rootScope, $http, $ionicPopup, $ionicLoading, BOOK, settings) {

    $scope.librarys = [];

    var id = $stateParams.id;

    $scope.loading = true;

    $scope.onRefresh = function() {
        $http.get(settings.URL.BOOK + "?friend=" + id)
        .success(function(response) {
            if (!response.errors) {
                var library = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author[0];//.author.join(", ");
                    library.push(item);
                });

                $scope.librarys = columnize(library, 2);
                $scope.loading = false;
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
    };


    $scope.onView = function(item) {
        BOOK.view(item);
    };

    $scope.onRefresh();


    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

});
