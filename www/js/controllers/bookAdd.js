angular.module("starter.controllers")

.controller("bookAddCtrl", function($scope, $stateParams, $ionicHistory, $ionicModal, $rootScope, $http, $ionicPopup, $ionicLoading, $cordovaBarcodeScanner, $cordovaToast, $cordovaCamera, $ionicActionSheet, $filter, settings, SHELF, USER) {

    var id = $stateParams.id;

    var trans = $filter('translate');


    if (!window.localStorage.popupISBN) {
        $ionicPopup.alert({
            cssClass: 'isbn-popup',
            okText: trans('book.popup_isbn_btn'),
            title: trans('book.popup_isbn_title'),
            template: String.format(
                trans('book.popup_isbn_info') + '<br /><br /><div class="center"><img style="width:80%" src="img/isbn.jpg" /></div>', $rootScope.user.first_name
            )
        }).then(function() {
            window.localStorage.popupISBN = true;
        });
    }


    var shelfHistory;



    $scope.shelfText = trans('book_form.shelf_empty');


    function inChecked(shelfs, id) {
        for (var i = 0; i < shelfs.length; i++) {
            if (shelfs[i].id == id) {
                return true;
            }
        }
        console.log('inChecked');
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
        console.log('prepareShelfForm');
        console.log(shelfs);
    };

    function valueShelfsForm() {
        var arr = [], txt=[];
        angular.forEach($scope.shelfsForm, function(v) {

            if (v.checked) {
                arr.push(v.id);
                txt.push(v.text);
            }

        });
        if (txt.length == 0) {
            $scope.shelfText = trans('book_form.shelf_empty');
        }
        else {
            $scope.shelfText = txt.join(', ');
        }

        console.log('valueShelfsForm');
        return arr;
    };

    if (!id) {
        $scope.form = {
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
        console.log($rootScope.shelfTmp);
        if ($rootScope.shelfTmp && $rootScope.shelfTmp.id) {
            $scope.form.shelfs.push($scope.shelfTmp);
            shelfHistory = $rootScope.shelfTmp.id;
            delete $rootScope.shelfTmp;

        }

        $scope.title = trans('book_form.title_create');
        prepareShelfForm($scope.form.shelfs);
        valueShelfsForm();


    }
    else {
        var updateBook = angular.copy($rootScope.bookUpdate);
        console.log(updateBook);
        prepareShelfForm(updateBook.shelfs);
        valueShelfsForm();
        $scope.form = updateBook;
        $scope.title = trans('book_form.title_update');
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


    $scope.doScan = function(input) {
        if(!input){
            console.log('---------');
            $cordovaBarcodeScanner.scan().then(function(code) {
                console.log(JSON.stringify(code));
                if (!code.cancelled && code.text && (code.format == 'EAN_13' || code.format == 'EAN_8')) {
                    searchISBN(code.text);
                    console.log(code.text);
                }
            }, function(error) {
                $ionicLoading.hide();
            });
        }
        else if (input.$modelValue.length === 13) {
            searchISBN(input.$modelValue);
        }
    };


    function searchISBN(isbn) {
        $ionicLoading.show({
            template: trans('book_form.isbn_searching')
        });
        var url = settings.URL.ISBN + "/" + isbn;
        $http.get(url)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {

                if (response.data.is_book) {
                    $ionicPopup.alert({
                        template: String.format(trans('book_form.isbn_duplicate'), response.data.title)
                    }).then(function() {});
                }
                else {
                    delete response.data.id;
                    response.data.isbn = parseInt(response.data.isbn,10);
                    response.data.page_count = parseInt(response.data.page_count,10);
                    response.data.published_year = parseInt(response.data.published_year,10);

                    angular.extend($scope.form, response.data);
                }


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
                template: trans('book_form.saving')
            });

            var post = {
                isbn: $scope.form.isbn,
                title: $scope.form.title,
                author: $scope.form.author,
                cover_source: $scope.form.cover_source,
                shelfs: valueShelfsForm(),
                rate: 0,

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
                        $cordovaToast.showLongBottom(trans('book_form.toast_create')).then(function() {});
                        resetForm();
                        $rootScope.$emit("library.refresh");
                        $rootScope.$emit("shelf.refresh");
                        $rootScope.$emit("library.shelf.refresh");
                        $ionicHistory.goBack();
                        USER.updateAmountBook();
                    }
                    else {
                        $ionicPopup.alert({
                            template: trans('book_form.isbn_duplicate_notice')
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
                        $cordovaToast.showLongBottom(trans('book_form.toast_update')).then(function() {});
                        //resetForm();
                        $rootScope.$emit("library.refresh");
                        $rootScope.$emit("shelf.refresh");
                        $rootScope.$emit("library.shelf.refresh");
                        $ionicHistory.goBack();
                    }
                    else {
                        $ionicPopup.alert({
                            template: trans('book_form.isbn_duplicate_notice')
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
                { text: "<i class=\"icon ion-android-camera\"></i> " + trans('book.sheet_photo') },
                { text: "<i class=\"icon ion-image\"></i> " + trans('book.sheet_picture')}
            ],
            cancelText: trans('book.sheet_cancel'),
            titleText: trans('book.sheet_title') + ' ' + $scope.form.title,
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


    $ionicModal.fromTemplateUrl('templates/book-form-shelf.html', {
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

    if (!id) {
        var config = $rootScope.user.config;
        console.log(config);
        if (config.enableIsbnDefault) {
            $scope.doScan();
        }
    }



});
