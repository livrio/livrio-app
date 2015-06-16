angular.module("starter.controllers")

.controller("libraryAddCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $cordovaBarcodeScanner, $cordovaToast, settings) {
    $scope.form = {
        isbn: "",
        title: "",
        author: "",
        thumb: "img/cover.png"
    };


    $scope.onCancel = function() {
        $scope.form = {
            isbn: "",
            title: "",
            author: "",
            thumb: "img/cover.png"
        };
        window.location = "#/main";
    };



    $scope.doScan = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            if (imageData.text) {
                $scope.form.isbn = imageData.text;
                searchISBN($scope.form.isbn);
                console.log(imageData.text);
            }
        }, function(error) {
            $ionicPopup.alert({title: "Código de barra inválido!"});
        });
    };


    function searchISBN(isbn) {
        $ionicLoading.show({
            template: "Pesquisando..."
        });
        var url = settings.URL.ISBN + "/" + isbn;
        $http.get(url)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {

                if (response.data.is_book) {
                    $ionicPopup.alert({
                        template: "O livro <strong>" + response.data.title + "</strong> já está cadastrado!"
                    }).then(function() {});
                }

                $scope.form.title = response.data.title;
                $scope.form.author = response.data.author;
                $scope.form.thumb = response.data.thumb;
            }
            else {
                console.log("ISBN NOT FOUND");
            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.error("TRATAR");
        });
    }


    $scope.doSave = function(isValid) {

        if (isValid) {
            $ionicLoading.show({
                template: "Salvando..."
            });

            var post = {
                isbn: $scope.form.isbn,
                title: $scope.form.title,
                author: $scope.form.author
            };



            $http.post(settings.URL.BOOK, post)
            .success(function(response) {
                $ionicLoading.hide();
                if (!response.errors) {
                    $cordovaToast.showLongBottom("Livro inserido!").then(function() {});
                    $scope.form = {};
                    $scope.submitted = false;
                    $rootScope.$emit("library.refresh");
                    window.location = "#/tab/library";
                }
                else {
                    $ionicPopup.alert({
                        template: "Já existe um livro cadastro com o ISBN informado"
                    }).then(function() {});
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                $ionicLoading.hide();
                console.error("TRATAR ERROR");
            });

        }
    };

});
