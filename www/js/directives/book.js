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
                event.stopPropagation();
                BOOK.menuAction(item);
            };
        },
        templateUrl: 'templates/directives/book.html'
    };
})
angular.module("livrio.directives")
.directive('bookinfo', function() {
    return {
        restrict: 'E',
        scope: {
            book: '=book'
        },
        templateUrl: 'templates/directives/book-info.html'
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
            case 'sent':
                o.description = String.format('Te emprestou este livro por {0} dias.',book.loaned.expired);
                o.buttons = [
                    {
                        text: 'Cancelar',
                        cls: 'danger',
                        action: 'sent_denied'
                    },
                    {
                        text: 'Confirmar',
                        cls: 'success',
                        action: 'sent_accept'
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
                        action: 'requested_accept'
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
        }
        console.log(book,o);
        return o;
    }


    function onChangeStatus(book, status) {
        var deferred = $q.defer();

        if (status == 'sent_denied' || status == 'requested_denied') {
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
                    BOOK.view($scope.book.id)
                    .then(function(data){
                        $scope.book = data;
                    });
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

