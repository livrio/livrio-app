angular.module('livrio.controllers')

.controller('about_ctrl', function($scope, $rootScope) {

    $scope.onTerms = function() {
        $rootScope.$emit("modal.terms");
    };


    $scope.versionName = ionic.Platform.isAndroid() ? 'Android' : 'iPhone';
});
