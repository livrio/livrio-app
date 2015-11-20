angular.module('livrio.services')
.factory('LOAN', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$filter',  'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, $filter, settings) {

    var self = this;

    var trans  = $filter('translate');

    function autor(v) {
        if (v && !(typeof v === 'string')) {
            return v.join(', ');
        }
        else {
            return v;
        }
    }

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
                response.data.author = autor(response.data.author);
                deferred.resolve(response.data);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
        });

        return deferred.promise;
    };

    

    self.changeStatus = function(book, status, text) {
        var post = {
            book: book,
            text: text || '',
            status: status || 'requested'
        };

        var deferred = $q.defer();
        $http.put(settings.URL.LOAN + "/status", post)
        .success(function(response) {
            if (!response.errors) {

                if (status == 'requested_canceled' || status == 'wait_delivery_canceled') {
                    $cordovaToast.showLongBottom(trans('loan.toast_request_cancel'));
                }
                else if (status == 'requested_returned') {
                    $cordovaToast.showLongBottom(trans('loan.toast_request'));
                }
                else if (status == 'requested_denied') {
                    $cordovaToast.showLongBottom(trans('loan.toast_loan_cancel'));
                }
                response.data.author = autor(response.data.author);
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
                $cordovaToast.showLongBottom(trans('loan.toast_request_loan'));
            });
            deferred.resolve();
        },
        function() {
            deferred.reject();
        });


        return deferred.promise;
    };




    return self;

}]);
