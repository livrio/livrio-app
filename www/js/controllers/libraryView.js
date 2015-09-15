angular.module('starter.controllers')

.controller('libraryViewCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicPopover, $ionicPopup, BOOK, LOAN) {

    var id = $stateParams.id;

    $scope.loading = true;
    var book;
    BOOK.view(id)
    .then(function(data) {
        $scope.loading = false;
        book = $rootScope.bookView = data;
    });




    $scope.onLoan = function(book) {
        $rootScope.$emit('loan.add',book);
    };


    $scope.onAction = function(event, book) {
        BOOK.menuAction(event, book);
    }



    $scope.onRequestLoan = function(book) {
        LOAN.requestLoan(book);
    }

    $scope.onChangeStatus = function(status) {

        if (status == 'delivered') {
            $ionicPopup.confirm({
                title: 'Empréstimo',
                cancelText: 'Não',
                okText: 'Sim',
                template: 'O livro <strong>' + book.title + '</strong> já está com você?'
            })
            .then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status)
                    .then(function(data) {
                        book.loaned = data.loaned;
                    });
                }
                else {
                    $ionicPopup.alert({
                        title: 'Empréstimo',
                        template: 'Combine e agende com seu amigo a entrega do livro.'
                    }).then(function(res) {
                    });
                }
            });
        }
        else if (status == 'sent_canceled') {
            $ionicPopup.prompt({
                title: 'Cancelar empréstimo',
                template: String.format('Você está cancelando o empréstimo do livro <strong>{0}</strong>. Informe o motivo do cancelamento para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Opcional">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        book.loaned = data.loaned;
                    });
                }
            });
        }
        else if (status == 'sent_refused') {
            $ionicPopup.prompt({
                title: 'Cancelar empréstimo',
                template: String.format('Você está recusando o empréstimo do livro <strong>{0}</strong>. Informe o motivo da recusa para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Opcional">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        book.loaned = data.loaned;
                    });
                }
            });
        }
        else if (status == 'requested_denied') {
            $ionicPopup.prompt({
                title: 'Recusar empréstimo',
                template: String.format('Você está recusando o empréstimo do livro <strong>{0}</strong>. Informe o motivo da recusa para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Opcional">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        book.loaned = data.loaned;
                    });
                }
            });
        }
        else {
            LOAN.changeStatus(book.id, status)
            .then(function(data) {
                book.loaned = data.loaned;
            });
        }


    }


});
