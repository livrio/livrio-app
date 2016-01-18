angular.module('livrio.controllers')

.controller('about_ctrl', function($scope, $rootScope, $ionicModal, FRIEND) {


    FRIEND.all({
        sort: 'amount',
        order: 'DESC',
        type: 'all',
        limit: 10
    })
    .then(function(data) {
        $scope.friends = data;
    })

    $ionicModal.fromTemplateUrl('templates/modal/top_10_book.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.onTerms = function() {
        $rootScope.$emit("modal.terms");
    };


    $scope.onTop10 = function() {
        $scope.modal.show();
    };


    $scope.versionName = ionic.Platform.isAndroid() ? 'Android' : 'iOS';
});
