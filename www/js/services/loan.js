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


    return self;

}]);
