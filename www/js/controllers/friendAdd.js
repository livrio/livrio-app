angular.module('starter.controllers')

.controller('friendAddCtrl', function($scope, $ionicHistory, $timeout, FRIEND) {

    $scope.showInput = false;

    $scope.showSearch = function() {
        $scope.showInput = true;
        console.log($scope.showInput);
    };

    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    var filterTextTimeout;

    $scope.searching = false;
    $scope.friendsResult = [];
    $scope.searchStart = false;

    $scope.onSearch = function(input) {
        console.log('search');
        if (input.length < 3) {
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            return;
        }
        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            console.log(input);
            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.search({
                word: input
            }).then(function(data) {
                $scope.searching = false;
                $scope.friendsResult = data;
                console.log(data);
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        console.log('clean');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.word = '';
        }
        $scope.searching = false;
        $scope.friendsResult = [];
        $scope.searchStart = false;
    };

    $scope.onAdd = function(item) {
        console.log('change');
        console.log(arguments);
        FRIEND.add(item).then(function() {
            item.added = true;
        });
    };


});