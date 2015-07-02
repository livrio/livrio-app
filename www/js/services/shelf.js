angular.module("starter.services")
.factory("SHELF", ["$rootScope", "$http", "$q", "$ionicPopup", "$ionicLoading", "$cordovaToast", "settings", "BOOK", function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, settings, BOOK) {

    var self = this;

    $rootScope.shelfs = [];


    function create(name) {
        var post = {
            name: name
        };
        $http.post(settings.URL.SHELF, post)
        .success(function(response) {
            if (!response.errors) {
                $cordovaToast.showLongBottom("Estante criada!").then(function() {});
                $rootScope.shelfs.push(response.data);
            }
            else {
                console.log('ERROR SHELF CREATE');
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
    }

    self.add = function(book) {
        $ionicPopup.prompt({
            title: "Nova estante",
            template: "Qual o nome da estante?"
        }).then(function(res) {
            console.log(res);
            if (res) {
                create(res);
            }
        });
    };

    self.getCache = function(id) {
        var result= {
            id: 0
        };
        angular.forEach(function(item) {
            if (id === item.id) {
                result = item;
                return false;
            }
        });

        return result;
    };

    self.books = function(id) {
        return BOOK.all({
            shelf: id || 0
        });
    };

    self.get = function(id) {
        var deferred = $q.defer();

        var shelf = self.getCache(id);

        if (shelf.id === 0) {
            $http.get(settings.URL.SHELF + "/" + id)
            .success(function(response) {
                if (!response.errors) {
                    deferred.resolve(response.data);
                }
                else {
                    console.log('ERROR SHELF CREATE');
                    deferred.reject('Greeting is not allowed.');
                }
            })
            .error(function() {
                console.log("TRATAR ERROR");
            });
        }
        else {
            deferred.resolve(shelf);
        }


        return deferred.promise;
    }


    self.all = function() {
        var deferred = $q.defer();
        $http.get(settings.URL.SHELF)
        .success(function(response) {
            if (!response.errors) {
                $rootScope.shelfs = response.data;
                deferred.resolve(response.data);
            }
            else {
                console.log('ERROR SHELF CREATE');
                deferred.reject('Greeting is not allowed.');
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    $rootScope.$on("shelf.refresh",function() {
        self.all();
    });


    return self;

}]);
