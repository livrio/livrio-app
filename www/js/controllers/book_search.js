angular.module("livrio.controllers")

.controller("book_search_ctrl", function($scope, $rootScope, $filter, $timeout, BOOK) {

    var filterTextTimeout;

    $scope.searching = false;
    $scope.librarys = [];
    $scope.libraryFriends = [];
    $scope.searchStart = false;

    var trans = $filter('translate');

    $scope.empty_list = trans('search.empty_list');
    $scope.empty_search = trans('search.empty_search');

    $scope.onSearch = function(input) {
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
            $scope.searching = true;
            $scope.searchStart = true;
            BOOK.all({
                limit: 40,
                search: input 
            }).then(function(data) {
                $scope.librarys = data;
                $scope.searching = false;
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.word = '';
        }
        $scope.searching = false;
        $scope.librarys = [];
        $scope.libraryFriends = [];
        $scope.searchStart = false;
    };


});
