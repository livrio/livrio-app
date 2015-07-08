angular.module('starter.services',[])
.factory('BOOK', ['$rootScope', '$state', '$http', '$q', '$ionicPopup',  '$ionicLoading', '$cordovaToast', '$cordovaCamera', '$ionicActionSheet', 'settings', function($rootScope, $state, $http, $q, $ionicPopup, $ionicLoading, $cordovaToast, $cordovaCamera, $ionicActionSheet, settings) {

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
                        window.location = "#/app/library";
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


    self.requestReturn = function(book) {
        var deferred = $q.defer();
        $http.post(settings.URL.BOOK + "/" + book.id + "/request-return")
        .success(function(response) {
            if (!response.errors) {
                $cordovaToast.showLongBottom("Seu amigo será avisado!").then(function() {});
                deferred.resolve();
            }
            else if (response.errors[0].code === 301) {
                $cordovaToast.showLongBottom("Já existe uma solicitação pendente!").then(function() {});
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
        var values = [];

        for (var i = 1;i <= 10;i++) {
            values.push("<option value=\"" + i + "\">" + i + "</option>");
        }

        $rootScope.day = 1;
        $rootScope.type = 1;

        var tpl = [
            "<p>Quantos tempo você precisa?</p>",
            "<div class=\"duration\"><select ng-model=\"type\">",
                "<option value=\"1\">Dia",
                "<option value=\"7\">Semana",
                "<option value=\"30\">Mês",
            "</select>",

            "<select ng-model=\"day\">",
                values.join(''),
            "</select></div>"

        ];

        // An elaborate, custom popup
        $ionicPopup.show({
            title: "Solicitação de empréstimo",
            template: tpl.join(''),
            cssClass: 'popup-loan',
            scope: $rootScope,
            buttons: [
                { text: "não" },
                {
                    text: "Solicitar",
                    onTap: function(e) {
                        var days = parseInt($rootScope.day,10) * parseInt($rootScope.type,10);
                        $cordovaToast.showLongBottom("Solicitação enviada!").then(function() {});
                        deferred.resolve();
                    }
                }
            ]
        }).then(function(res) {
            console.log('TAP');
            deferred.resolve();
        });

        return deferred.promise;
    }

    self.persistCover = function(book, cover) {
        var deferred = $q.defer();
        var post = {
            cover_source: cover
        };

        $http.put(settings.URL.BOOK + "/" + book.id, post)
        .success(function(response) {

            if (!response.errors) {
                $cordovaToast.showLongBottom("Capa atualizada!").then(function() {});
                $rootScope.$emit("library.refresh");
                deferred.resolve(response.data.thumb);
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


    self.changeCover = function(book, autosave) {
        var deferred = $q.defer();
        $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-android-camera\"></i> Tirar foto" },
                { text: "<i class=\"icon ion-image\"></i> Imagem"}
            ],
            titleText: 'Capa do livro: ' + book.title,
            buttonClicked: function(index) {

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
                    if (autosave) {
                        self.persistCover(book, imageData)
                        .then(function(url) {
                            deferred.resolve(url);
                        },
                        function() {
                            deferred.reject();
                        });
                    }
                    else {
                        deferred.resolve(imageData);
                    }

                }, function(err) {
                    deferred.reject();
                });

                return true;
            }
        });
        return deferred.promise;
    };

    self.menuAction = function(event, book) {
        console.log(arguments);
        event.stopPropagation();

        var options = [
                { text: "<i class=\"icon ion-edit\"></i> Editar" },
                { text: "<i class=\"icon ion-android-image\"></i> Alterar capa" }
            ];

        if (book.loaned) {
            options.push({ text: "<i class=\"icon ion-arrow-swap\"></i> Solicitar devolução" });
        }
        else {
            options.push({ text: "<i class=\"icon ion-arrow-swap\"></i> Emprestar" });
        }

        $ionicActionSheet.show({
            buttons: options,
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
                    self.changeCover(book, true)
                    .then(function(url) {
                        book.thumb = url;
                    });
                }
                else if (index === 2) {
                    if (book.loaned) {
                        self.requestReturn(book);
                    }
                    else {
                        $state.go('app.loanAdd',{
                            id: book.id
                        });
                    }
                }
                return true;
            }
        });
    };

    return self;


}]);
