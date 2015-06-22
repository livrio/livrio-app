angular.module('starter.services',[])
.factory('BOOK', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$cordovaToast', '$ionicActionSheet', 'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, $ionicActionSheet, settings) {

    var self = this;



    self.delete = function(book) {
        var tpl = "Deseja excluir este livro?<br /><br /><strong>" + book.title + "</strong>";
        $ionicPopup.confirm({
            template: tpl
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


    self.view = function(book) {
        $rootScope.bookView = book;
        window.location = "#/library-view/" + book.id;
    };

    self.update = function(book) {
        $rootScope.bookUpdate = book;
        window.location = "#/library-form/" + book.id;
    };


    self.menuAction = function(event, book) {
        event.stopPropagation();

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-edit\"></i> Editar" }
            ],
            destructiveText: "<i class=\"icon ion-trash-a\"></i> Excluir",
            titleText: book.title,
            cancelText: "Cancelar",
            destructiveButtonClicked: function() {
                self.delete(book);
                return true;
            },
            buttonClicked: function(index) {
                self.update(book);
                return true;
            }
        });
    };


    return self;


}]);
