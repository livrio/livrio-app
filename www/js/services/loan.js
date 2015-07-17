angular.module('starter.services')
.factory('LOAN', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$cordovaToast', 'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, settings) {

    var self = this;

    self.delete = function(book) {
        $ionicLoading.show({
            template: "Devolvendo..."
        });
        var old = angular.copy(book.loaned);
        book.loaned = null;
        $http.delete(settings.URL.BOOK + "/" + book.id + "/loan")
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                console.log("Devolvido");
                $cordovaToast.showLongBottom("Livro retornado!").then(function() {});
            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.log("TRATAR ERROR");
            book.loaned = old;
            $rootScope.$emit("error.http");
        });
    };


    self.add = function(book, user, duration, status) {
        var post = {
            book: book,
            user: user,
            duration: duration || 1,
            status: status || 'requested'
        };

        var deferred = $q.defer();
        $http.put(settings.URL.LOAN + "/start", post)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
            console.log("TRATAR ERROR");
        });

        return deferred.promise;
    };

    

    self.changeStatus = function(book, status) {
        var post = {
            book: book,
            status: status || 'requested'
        };

        var deferred = $q.defer();
        $http.put(settings.URL.LOAN + "/status", post)
        .success(function(response) {
            if (!response.errors) {

                if (status == 'requested_canceled' || status == 'wait_delivery_canceled') {
                    $cordovaToast.showLongBottom("Solicitação cancelada!").then(function() {});
                }
                else if (status == 'requested_returned') {
                    $cordovaToast.showLongBottom("Solicitação enviada!").then(function() {});
                }
                else if (status == 'requested_denied') {
                    $cordovaToast.showLongBottom("Empréstimo cancelado!").then(function() {});
                }
                else if (status == 'wait_delivery') {
                    $ionicPopup.alert({
                        title: "Empréstimo",
                        template: "Empréstimo realizado!<br />Agora entre em contato com seu amigo para efetuar a entrega do livro."
                    }).then(function(res) {
                        deferred.resolve();
                    });
                }

                deferred.resolve(response.data);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
            console.log("TRATAR ERROR");
        });

        return deferred.promise;
    };




    self.requestLoan = function(book) {

        var deferred = $q.defer();


        $rootScope.$emit("loan.modal", book, function(duration) {
            console.log('success');
            self.add(book.id, $rootScope.user.id, duration)
            .then(function(data) {
                book.loaned = data.loaned;
                $cordovaToast.showLongBottom("Solicitação enviada!").then(function() {});
            });
            deferred.resolve();
        },
        function() {
            deferred.reject();
        });


        return deferred.promise;
    };

    self.responseRequestLoan = function(notice, option) {
        var deferred = $q.defer();
        var post = {
            notification: notice.id,
            response: option
        };

        $http.post(settings.URL.LOAN + "/response-request-book",post)
        .success(function(response) {
            if (!response.errors) {
                if (option == 'yes') {
                    $ionicPopup.alert({
                        title: "Empréstimo",
                        template: "Empréstimo realizado!<br />Agora entre em contato com seu amigo para efetuar a entrega do livro."
                    }).then(function(res) {
                        deferred.resolve();
                    });
                }

            }
            else {
                deferred.reject();
            }

        });
        return deferred.promise;
    };

    self.laonConfirmed = function(notice, option) {
        var deferred = $q.defer();
        var post = {
            notification: notice.id,
            response: option
        };

        $http.post(settings.URL.LOAN + "/loan-confirmed-book",post)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve();

            }
            else {
                deferred.reject();
            }

        });
        return deferred.promise;
    };




    return self;

}]);
