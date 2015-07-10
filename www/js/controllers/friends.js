angular.module("starter.controllers")

.controller("friendsCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $ionicModal, $timeout, FRIEND, settings) {
    $scope.friends = [];

    $scope.loading = true;

    $scope.onRefresh = function() {
        FRIEND.search()
        .then(function(data) {
            $scope.friends = data;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };


    $scope.doFacebook = function() {
        $scope.loading = true;
        FRIEND.addOnFacebook()
        .then(function() {
            $scope.onRefresh();
            $rootScope.user.is_facebook = true;
        },
        function() {});
    };

    $scope.doInvite = function() {
        FRIEND.inviteEmail();
    };



    $scope.onRefresh();


    $rootScope.$on("friend.refresh",function() {
        $scope.onRefresh();
    });

});
