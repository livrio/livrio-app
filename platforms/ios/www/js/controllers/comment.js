angular.module('starter.controllers')

.controller('commentCtrl', function($scope, $rootScope, $filter, $timeout, $interval, $cordovaSocialSharing, BOOK,  FRIEND, settings) {


    var book = $scope.bookView;

    $scope.loading = true;


    var trans = $filter('translate');

    $scope.empty_list = trans('comment.empty_list');

    

    $scope.comments = [];

    $scope.onRefresh = function() {

        BOOK.comments(book)
        .then(function(data) {
            $scope.comments = [];
            angular.forEach(data, function(item) {
                item.date = $filter('dateparse')(new Date(item.registration));
                $scope.comments.push(item);
            });
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');

            $interval(function() {
                angular.forEach($scope.comments, function(item) {
                    item.date = $filter('dateparse')(new Date(item.registration));
                });
            }, 60000);
        });
    };

    $scope.onRefresh();


    $scope.onComment = function(form, message) {
        console.log('message',message);
        if (message.length <= 2) {
            return;
        }
        BOOK.comment(book, message)
        .then(function(data) {
            console.log(data);
            data.date = $filter('dateparse')(new Date(data.registration));
            $scope.comments.unshift(data);
        });

        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.message = '';
        }
    };




});
