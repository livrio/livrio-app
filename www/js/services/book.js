angular.module('starter.services',[])
.factory('BOOK', ['$rootScope', '$state', '$http', '$q', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$ionicActionSheet', 'settings', function($rootScope, $state, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, $ionicActionSheet, settings) {

    var self = this;



    self.delete = function(book) {
        $ionicPopup.confirm({
            title: 'Deseja excluir este livro?',
            cancelText: 'Não',
            okText: 'Sim',
            template: book.title
        }).then(function(res) {
            if (res) {
                $ionicLoading.show({
                    template: "Excluindo..."
                });
                book.removed = true;
                $http.delete(settings.URL.BOOK + "/" + book.id)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (!response.errors) {
                        $cordovaToast.showLongBottom("Livro excluído!").then(function() {});
                        window.location = "#/app/tab/library";
                    }
                    else {
                        console.log('EROOR DELETE');
                    }
                })
                .error(function() {
                    $ionicLoading.hide();
                    console.log("TRATAR ERROR");
                    book.removed = false;
                    $rootScope.$emit("error.http");
                });
            }
        });

    };





    self.view = function(id) {
        var deferred = $q.defer();
        $http.get(settings.URL.BOOK + "/" + id)
        .success(function(response) {
            if (!response.errors) {
                response.data.author = response.data.author.join(", ");
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

    self.update = function(book) {
        $rootScope.bookUpdate = book;
        window.location = "#/library-form/" + book.id;
    };


    self.menuAction = function(event, book) {
        console.log(arguments);
        event.stopPropagation();
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-edit\"></i> Editar" },
                { text: "<i class=\"icon ion-arrow-swap\"></i> Emprestar" }
            ],
            destructiveText: "<i class=\"icon ion-trash-a\"></i> Excluir",
            titleText: book.title,
            cancelText: "Cancelar",
            destructiveButtonClicked: function() {
                self.delete(book);
                return true;
            },
            buttonClicked: function(index) {
                if (index === 0) {
                    self.update(book);
                }
                else if (index === 1) {
                    $state.go('app.loanAdd',{
                        id: book.id
                    });
                }
                return true;
            }
        });
    };


    self.all = function(params) {
        params = params || {};

        params.sort = 'id';
        params.order = 'desc';
        var deferred = $q.defer();
        $http.get(settings.URL.BOOK, {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                var library = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author.join(", ");
                    library.push(item);
                });
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        })
        .error(function() {
            deferred.resolve([]);
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    return self;


}]);
