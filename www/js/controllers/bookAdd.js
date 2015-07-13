angular.module("starter.controllers")

.controller("bookAddCtrl", function($scope, $stateParams, $ionicModal, $timeout, $rootScope, $http, $ionicPopup, $ionicLoading, $cordovaBarcodeScanner, $cordovaOauth, $cordovaToast, $cordovaCamera, $ionicActionSheet, settings, SHELF) {

    var id = $stateParams.id;


    $scope.rate_max = 5;

    console.log('form');

    $scope.shelfText = 'Nenhuma estante';


    function inChecked(shelfs, id) {
        for (var i = 0; i < shelfs.length; i++) {
            if (shelfs[i].id == id) {
                return true;
            }
        }

        return false;
    }

    function prepareShelfForm(shelfs) {
        $scope.shelfsForm = [];
        angular.forEach($rootScope.shelfs, function(v) {
            $scope.shelfsForm.push({
                text: v.name,
                id: v.id,
                checked: inChecked(shelfs, v.id)
            });
        });

        console.log($scope.shelfsForm);
    };

    function valueShelfsForm(shefs) {
        var arr = [], txt=[];
        angular.forEach($scope.shelfsForm, function(v) {

            if (v.checked) {
                arr.push(v.id);
                txt.push(v.text);
            }

        });
        if (txt.length == 0) {
            $scope.shelfText = 'Nenhuma estante';
        }
        else {
            $scope.shelfText = txt.join(', ');
        }


        return arr;
    };

    if (!id) {
        $scope.form = {
            rate: 2,
            isbn: "",
            title: "",
            author: "",
            thumb: "img/cover.gif",
            shelfs: [],
            config: {
                loan: true,
                read: false
            }
        };

        $scope.title = 'Novo livro';
        prepareShelfForm([]);
    }
    else {
        var updateBook = angular.copy($rootScope.bookUpdate);
        console.log(updateBook);
        prepareShelfForm(updateBook.shelfs);
        $scope.form = updateBook;
        $scope.title = 'Edição de livro';
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

                angular.extend($scope.form, response.data);

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
                cover_source: $scope.form.cover_source,
                shelfs: valueShelfsForm(),
                rate: $scope.form.rate || 1,

                publisher: $scope.form.publisher,
                published_year: $scope.form.published_year,
                page_count: $scope.form.page_count,
                config: $scope.form.config
            };

            if (!id) {
                $http.post(settings.URL.BOOK, post)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (!response.errors) {
                        $cordovaToast.showLongBottom("Livro inserido!").then(function() {});
                        resetForm();
                        $rootScope.$emit("library.refresh");
                        $rootScope.$emit("shelf.refresh");
                        window.location = "#/app/library";
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
                        $rootScope.$emit("shelf.refresh");
                        window.location = "#/app/library";
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


    $scope.doCreateShelf  = function() {
        SHELF.add()
        .then(function(data) {
            $scope.shelfsForm.push({
                text: data.name,
                id: data.id,
                checked: true
            });
        });
    };


    $ionicModal.fromTemplateUrl('templates/modal_shelf.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalShelf = modal;
    });


    $scope.onShelf = function() {
        $scope.modalShelf.show();
    };

    $scope.onSaveShelf = function() {
        valueShelfsForm();
        $scope.modalShelf.hide();
    };

    $scope.onCloseModal = function() {
        if (id) {
            prepareShelfForm(updateBook.shelfs);
        } else if (!id) {
            prepareShelfForm([]);
        }
        $scope.modalShelf.hide();
    };



});
