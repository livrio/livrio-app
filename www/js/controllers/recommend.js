angular.module('starter.controllers')

.controller('recommendCtrl', function($scope, $rootScope, $ionicHistory, $http, $ionicPopup, $filter,  FRIEND, BOOK, settings) {

    var trans = $filter('translate');
    var book = $rootScope.bookView;
    $scope.loading = true;

    $scope.loadText = trans('loading');

    $scope.empty_list = trans('recommend.empty_list');

    $scope.friends = [];

    $scope.onRefresh = function() {
        FRIEND.all()
        .then(function(data) {
            $scope.friends = data;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.doRecommend = function(user) {
        console.log(user);

        BOOK.recommend($scope.bookView, user.id)
        .then(function() {
            window.location = '#/app/book/' + book.id;
        });

    };

    $scope.onRefresh();
});
