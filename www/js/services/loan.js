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

    self.messages = function(id, offset) {
        var deferred = $q.defer();

        $http.get(toRouter('/books/{0}/loan/messages',id),{
            params: {
                offset: offset || 0
            }
        })
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(response._items);
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

    self.createMessage = function(id, text) {
        var deferred = $q.defer();

        $http.post(toRouter('/books/{0}/loan/messages',id),{'text':text})
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(response);
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


    self.get = function(id){
        var deferred = $q.defer();

        $http.get(toRouter('/books/{0}/loan',id))
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(response);
            }
            else {
                deferred.reject();
            }
        })
        .error(function() {
            deferred.reject();
        });

        return deferred.promise;
    }

    self.add = function(book, user, duration) {
        var post = {
            'friend_id': user,
            duration: duration || 1
        };

        var deferred = $q.defer();
        $http.post(toRouter('/books/{0}/loan', book), post)
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(response);
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
            text: text || '',
            status: status || 'requested'
        };

        var deferred = $q.defer();
        $http.post(toRouter('/books/{0}/loan/status',book), post)
        .success(function(response) {
            if (response._status == 'OK') {
                deferred.resolve(true);
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




    self.requestLoan = function(book) {

        var deferred = $q.defer();


        $rootScope.$emit("loan.modal", book, function(duration) {
            console.log('success');
            self.add(book._id, $rootScope.user._id, duration)
            .then(function(data) {
                book.loaned = data;
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
