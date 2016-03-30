angular.module('livrio.controllers')

.controller('help_ctrl', function($scope, $rootScope, $ionicModal, $http, settings) {

    $scope.questions = [];
    $scope.more = '';
    $http.get(settings.URL.QUESTION)
    .success(function(response) {
        $scope.questions = response.data;
        $scope.more = response.more;
    });

    $ionicModal.fromTemplateUrl('templates/modal/question.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalQuestion = modal;
    });

    $scope.closeModal = function() {
        $scope.modalQuestion.hide();
    };


    $scope.onShowQuestion = function(item) {
        $scope.question_selected = item;
        $scope.modalQuestion.show();
    };
});
