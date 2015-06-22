angular.module("starter.controllers")

.controller("libraryAddCtrl", function($scope, $stateParams, $ionicHistory, $timeout, $rootScope, $http, $ionicPopup, $ionicLoading, $cordovaBarcodeScanner, $cordovaOauth, $cordovaToast, $cordovaCamera, $ionicActionSheet, settings) {

    var id = $stateParams.id;

    console.log('form');

    if (!id) {
        $scope.form = {
            isbn: "",
            title: "",
            author: "",
            thumb: "img/cover.gif"
        };
    }
    else {
        $scope.form = $rootScope.bookUpdate;
    }


    var formLibrary = null;

    function resetForm() {
        $scope.form = {
            thumb: "img/cover.gif"
        };

        if (formLibrary) {
            formLibrary.$setPristine();
            formLibrary.$setUntouched();
        }
    }

    $scope.onCancel = function() {
        resetForm();
        $ionicHistory.goBack();
        // window.location = "#/app/tab/library";
    };



    $scope.doScan = function() {
        console.log('---------');
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


    $scope.doSave = function(form) {
        formLibrary = form;
        if (form.$valid) {
            $ionicLoading.show({
                template: "Salvando..."
            });

            var post = {
                isbn: $scope.form.isbn,
                title: $scope.form.title,
                author: $scope.form.author,
                cover_source: $scope.form.cover_source
            };

            if (!id) {
                $http.post(settings.URL.BOOK, post)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (!response.errors) {
                        $cordovaToast.showLongBottom("Livro inserido!").then(function() {});
                        resetForm();
                        $rootScope.$emit("library.refresh");
                        window.location = "#/app/tab/library";
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
            } else {
                $http.put(settings.URL.BOOK + "/" + id, post)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (!response.errors) {
                        $cordovaToast.showLongBottom("Livro atualizado!").then(function() {});
                        //resetForm();
                        $rootScope.$emit("library.refresh");
                        window.location = "#/app/tab/library";
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



        }
    };

    $scope.onPicture = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-android-camera\"></i> Tirar foto" },
                { text: "<i class=\"icon ion-image\"></i> Imagem"}
            ],
            cancelText: 'Cancelar',
            titleText: 'Capa do livro ' + $scope.form.title,
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                onPicture(index);
                return true;
            }
        });
    };


    /*
[{
"name":"1434067203570.jpg",
"localURL":"cdvfile://localhost/persistent/Pictures/1434067203570.jpg",
"type":"image/jpeg",
"lastModified":null,
"lastModifiedDate":1434067203000,"size":6690954,"start":0,"end":0,
"fullPath":"file:/storage/emulated/0/Pictures/1434067203570.jpg"}]
    */
    var onPicture = function(index) {
        var sourceType = index === 0 ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 150,
            targetHeight: 210,
            correctOrientation: false,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData);
            $scope.form.thumb = 'data:image/jpeg;base64,' + imageData;
            $scope.form.cover_source = imageData;
        }, function(err) {
            console.log(JSON.stringify(arguments));
            console.error('TRATAR ERROR');
        });
    };


    // $scope.doImport = function(){
    //     $cordovaOauth.google("966956371758-5q9774rtrl4t1dvt5bm8gb6in9kvbif3.apps.googleusercontent.com", ["https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
    //            console.log('auth');
    //     }, function(error) {
    //         console.log(JSON.stringify(arguments));
    //         console.log('auth error');
    //     });
    // }

});
