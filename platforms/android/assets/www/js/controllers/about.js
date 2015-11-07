angular.module('starter.controllers')

.controller('aboutCtrl', function($scope, $ionicPopup, $filter) {

    var trans = $filter('translate');
    var t = trans('translate')('AURELIO');
    $scope.easterEggActive = 0;
    $scope.onEasterEgg = function() {
        $scope.easterEggActive++;
        if ($scope.easterEggActive == 3) {
            $ionicPopup.alert({
                title:'Autores',
                template: 'Aurélio Saraiva<br />Renata Miguez<br />Daniel Ranzi Werle<br />Leonardo Corbisier'
            }).then(function() {});
            $scope.easterEggActive = 0;
        }
    }

});
