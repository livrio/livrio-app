angular.module('starter.controllers')

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, PUSH, FRIEND) {


    $timeout(function() {
        PUSH.markRead();
    },1000);

    $scope.onRefresh = function() {
        PUSH.all()
        .then(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };


    $scope.onAction = function(item) {
        if (item.type == 'request_friend') {
            $ionicPopup.confirm({
                title: 'Solicitação de amizade',
                cancelText: 'Ignorar',
                okText: 'Aceitar',
                template: 'Deseja aceitar a soliciação de amizade de <strong>' + item.created_by.fullname + '</strong>'
            })
            .then(function(res) {
                 if (res) {
                     FRIEND.confirm(item, 'yes');
                 }
                 else {
                     FRIEND.confirm(item, 'no');
                 }
             });
        }
    }

});
