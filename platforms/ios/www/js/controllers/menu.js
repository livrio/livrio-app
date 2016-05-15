angular.module('livrio.controllers')

.controller('menu_ctrl', function($scope, $state, $rootScope, $ionicPopover, $ionicHistory, $ionicSideMenuDelegate, SHELF, PUSH) {

    SHELF.all();

    PUSH.all();

    $scope.onShelfAdd = function() {
        SHELF.add()
        .then(function(item) {
            $ionicSideMenuDelegate.toggleLeft();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.book-shelf',{
                id: item._id
            });
            $ionicHistory.clearCache();
        });
    };

    $scope.doLogout = function() {
        window.localStorage.clear();
        window.localStorage.email = $rootScope.user.email;
        if (ionic.Platform.isAndroid()) {
            window.location = '#/login';
        }
        else {
            ionic.Platform.exitApp();
            window.location = '#/login';
        }
        $ionicHistory.clearCache();
    };
});

