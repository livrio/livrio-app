angular.module("livrio.controllers")

.controller("friend_ctrl", function($scope, $rootScope, $filter, FRIEND) {
    $scope.friends = [];

    $scope.loading = true;

    var trans = $filter('translate');

    $scope.info_facebook = trans('friend.info_facebook');

    $scope.empty_list = trans('friend.empty_list');

    $scope.onRefresh = function() {
        FRIEND.all()
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


    $scope.onRefresh();

    $rootScope.$on("friend.refresh",function() {
        $scope.onRefresh();
    });

});
