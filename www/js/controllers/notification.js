angular.module('starter.controllers')

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, PUSH, LOAN) {


    $timeout(function() {
        PUSH.markRead();
    },1000);




    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    $scope.onClick = function(item) {
        if (item.type == "loan_confirm") {
            $ionicPopup.show({
                template: "Emprestar o livro <strong>" + item.book.title + "</strong> para <strong>" + item.created_by.fullname + "</strong>?",
                title: "Solicitação de empréstimo",
                buttons: [
                    { text: 'Cancelar' },
                    {
                        text: 'Não',
                        onTap: function(e) {
                            LOAN.responseRequestLoan(item, 'no')
                            .then(function() {
                                window.location = '#/app/notification';
                            });
                        }
                    },
                    {
                        text: 'Sim',
                        onTap: function(e) {
                            LOAN.responseRequestLoan(item, 'yes')
                            .then(function() {
                                window.location = '#/app/notification';
                            });
                        }
                    }
                ]
            }).then(function() {});
        }
        else if (item.type == "loan_confirm_yes") {
            $ionicPopup.show({
                template: "<strong>" + item.created_by.fullname  + "</strong> já te entregou o livro <strong>" + item.book.title + "</strong>?",
                title: "Solicitação de empréstimo",
                buttons: [
                    { text: 'Não' },
                    {
                        text: 'Sim',
                        onTap: function(e) {
                            LOAN.laonConfirmed(item, 'yes')
                            .then(function() {
                                item.content.response = 'yes';
                            });
                        }
                    }
                ]
            }).then(function() {});
        }
    };


})

.controller('notificationLoanCtrl', function($scope, $stateParams, $rootScope, PUSH, LOAN) {
    

    var notice = PUSH.get($stateParams.id);

    console.log(notice);

    $scope.friend = notice.item.user;
    $scope.book = notice.item.book;


    $scope.doNotLoan = function () {
        
    };

    $scope.doLoan = function () {
        LOAN.responseRequestLoan(notice, 'yes')
        .then(function () {
            window.location = '#/app/notification';
        });
    };

});

