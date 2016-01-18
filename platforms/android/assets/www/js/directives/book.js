angular.module("livrio.directives",[])
.directive('book', function() {
    return {
        restrict: 'E',
        scope: {
            book: '=book',
            button: '=',
            owner: '='
        },
        controller: function($scope, $rootScope, BOOK) {

            $scope.user = $rootScope.user;

            $scope.onActionBook = function(event, item) {
                $rootScope.tmp_book_update = item;
                BOOK.menuAction(event, item);
            };
        },
        templateUrl: 'templates/directives/book.html'
    };
})
.directive('friend', function() {
    return {
        restrict: 'E',
        scope: {
            friend: '=friend',
            button: '='
        },
        controller: function($scope, $state, $rootScope, FRIEND) {

            $scope.user = $rootScope.user;

            $scope.onLink = function(item) {
                if (!item.is_contact) {
                    $state.go('app.friend-profile',{
                        id: item.id
                    });
                }
            }

            $scope.onAdd = function(e, item) {
                e.stopPropagation();
                item.added = true;
                $scope.button = false;
                FRIEND.add(item);
            };

            $scope.onInvite = function(e, item) {
                e.stopPropagation();
                item.invited = true;
                $scope.button = false;
                FRIEND.invite(item);
            };

        },
        templateUrl: 'templates/directives/friend.html'
    };
})
.directive('bookaction', function($q, $ionicPopup, $filter, BOOK, LOAN) {

    var trans  = $filter('translate');

    function processLoaned(book) {
        var o = {};
        switch (book.loaned.status) {
            case 'wait_delivery':
            case 'sent':
                o.description = String.format('Te emprestou este livro por {0} dias.',book.loaned.expired);
                o.buttons = [
                    {
                        text: 'Cancelar',
                        cls: 'danger',
                        action: 'requested_denied'
                    },
                    {
                        text: 'Confirmar',
                        cls: 'success',
                        action: 'delivered'
                    }
                ];
            break;

            case 'requested':
                o.description = 'Aguardando confirmação de empréstimo.';
                o.buttons = [
                    {
                        text: 'Cancelar solicitação',
                        cls: 'danger',
                        action: 'requested_canceled'
                    }
                ];
            break;

            case 'delivered':
                o.description = 'Livro emprestado a você. ';

                if (book.loaned.expired > 0) {
                    o.description += String.format('Devolução prevista em {0} dias.',book.loaned.expired)
                }
                else {
                    o.description += String.format('Empréstimo atrasado.')
                }

                o.buttons = [
                    {
                        text: 'Devolver',
                        cls: 'success',
                        action: 'wait_return'
                    }
                ];
            break;
            case 'wait_return':
                o.description = 'Livro emprestado a você. Aguardando confirmação de devolução.';
            break;

            case 'requested_returned':
                o.description = 'Solicitou a devolução deste livro.';
                o.buttons = [
                    {
                        text: 'Confirmar solicitação',
                        cls: 'success',
                        action: 'wait_return'
                    }
                ];
            break;

        }
        console.log(book,o);
        return o;
    }

    function processOwner(book) {
        var o = {};
        switch (book.loaned.status) {
            case 'requested':
                o.description = String.format('Solicitou empréstimo deste livro por {0} dias.',book.loaned.expired);
                o.buttons = [
                    {
                        text: 'Cancelar',
                        cls: 'danger',
                        action: 'requested_denied'
                    },
                    {
                        text: 'Emprestar',
                        cls: 'success',
                        action: 'wait_delivery'
                    }
                ];
            break;
            case 'sent':
                o.description = 'Aguardando seu amigo confirmar recebimento do livro.'
                o.buttons = [
                    {
                        text: 'Cancelar empréstimo',
                        cls: 'danger',
                        action: 'sent_canceled'
                    }
                ];
            break;

            case 'wait_return':
                o.description = 'Aguardando você confirmar devolução do livro.'
                o.buttons = [
                    {
                        text: 'Confirmar devolução',
                        cls: 'success',
                        action: 'returned'
                    }
                ];
            break;

            case 'wait_delivery':
                o.description = 'Aguardando seu amigo confirmar recebimento do livro.'
                o.buttons = [
                    {
                        text: 'Cancelar empréstimo',
                        cls: 'danger',
                        action: 'wait_delivery_canceled'
                    }
                ];
            break;

            case 'delivered':
                o.description = String.format('Devolução prevista em {0} dias',book.loaned.expired);
                o.buttons = [
                    {
                        text: 'Solicitar devolução',
                        cls: 'success',
                        action: 'requested_returned'
                    }
                ];
            break;

            case 'requested_returned':
                o.description = 'Aguardando seu amigo responder a solicitação de devolução.';
                o.buttons = [
                    {
                        text: 'Cancelar solicitação',
                        cls: 'danger',
                        action: 'delivered'
                    }
                ];
            break;
        }
        console.log(book,o);
        return o;
    }


    function onChangeStatus(book, status) {
        var deferred = $q.defer();
        console.log('onChangeStatus',status);
        console.log(arguments);
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
                        deferred.resolve(data);
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
                template: String.format('Você está cancelando o empréstimo do livro <strong>{0}</strong>. Informe o motivo do cancelamento para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Qual motivo?">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
                }
            });
        }
        else if (status == 'sent_refused') {
            $ionicPopup.prompt({
                title: 'Cancelar empréstimo',
                template: String.format('Você está recusando o empréstimo do livro <strong>{0}</strong>. Informe o motivo da recusa para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Qual motivo?">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
                }
            });
        }
        else if (status == 'requested_denied') {
            $ionicPopup.prompt({
                title: 'Recusar empréstimo',
                template: String.format('Você está recusando o empréstimo do livro <strong>{0}</strong>. Informe o motivo da recusa para seu amigo.',book.title) + '<input ng-model="data.response" type="text" placeholder="Qual motivo?">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
                }
            });
        }
        else if (status == 'wait_delivery') {
            $ionicPopup.prompt({
                title: trans('loan.title_loan'),
                template: trans('loan.msg_loan_info') + '<input ng-model="data.response" type="text" placeholder="Escreva aqui uma mensagem">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus(book.id, status, res)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
                }
            });
        }
        else {
            LOAN.changeStatus(book.id, status)
            .then(function(data) {
                deferred.resolve(data);
            });
        }

        return deferred.promise;
    }

    return {
        restrict: 'E',
        scope: {
            book: '=',
            status: '=',
            action: '&onChangeStatus'
        },
        controller: function($scope, $rootScope, BOOK) {

            $scope.show = false;
            console.log($scope);
            $scope.$watch('status',function(book) {
                console.log('status');
                console.log($scope);
                changeBook($scope.book);
            });

            function changeBook(book) {
                console.log('book');
                if (!book) {
                    return;
                }
                var user = $rootScope.user;
                var loaned = book.loaned;

                if (!book.is_owner) {
                    $scope.show = book.loaned && book.loaned.id == $rootScope.user.id;
                    var owner = book.owner;
                    $scope.photo = owner.photo;
                    $scope.fullname = owner.fullname;
                    $scope.user_id = owner.id;
                    $scope.options = processLoaned(book);

                }
                else {
                    $scope.show = book.loaned && book.owner.id == $rootScope.user.id;
                    $scope.photo = loaned.photo;
                    $scope.fullname = loaned.fullname;
                    $scope.user_id = loaned.id;
                    $scope.options = processOwner(book);
                }
            }
            $scope.$watch('book',changeBook);

            $scope.onAction = function(v) {
                console.log('action:',v);
                onChangeStatus($scope.book, v).then(function(data) {
                    $scope.book = data;
                });
            }



        },
        templateUrl: 'templates/directives/book_action.html'
    };
})
.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus(); 
      }, 150);
    }
  };
});

