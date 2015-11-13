angular.module('livrio.services',[])
.factory('BOOK', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicHistory', '$ionicLoading', '$cordovaToast', '$cordovaCamera', '$ionicActionSheet', '$state', '$filter', '$cordovaBarcodeScanner', 'settings','USER', function($rootScope, $http, $q, $ionicPopup, $ionicHistory, $ionicLoading, $cordovaToast, $cordovaCamera, $ionicActionSheet, $state, $filter, $cordovaBarcodeScanner, settings, USER) {

    var self = this;

    var trans = $filter('translate');

    self.isISBN = function(str) {

        var sum,
            weight,
            digit,
            check,
            i;

        str = str.replace(/[^0-9X]/gi, '');

        if (str.length != 10 && str.length != 13) {
            return false;
        }

        if (str.length == 13) {
            sum = 0;
            for (i = 0; i < 12; i++) {
                digit = parseInt(str[i], 10);
                if (i % 2 == 1) {
                    sum += 3 * digit;
                } else {
                    sum += digit;
                }
            }
            check = (10 - (sum % 10)) % 10;
            return (check == str[str.length - 1]);
        }

        if (str.length == 10) {
            weight = 10;
            sum = 0;
            for (i = 0; i < 9; i++) {
                digit = parseInt(str[i], 10);
                sum += weight * digit;
                weight--;
            }
            check = 11 - (sum % 11);
            if (check == 10) {
                check = 'X';
            }
            return (check == str[ str.length - 1 ].toUpperCase());
        }
    }


    self.getByISBN = function(isbn) {
        var deferred = $q.defer();
        isbn = isbn.replace(/[^0-9X]/gi, '');
        var url = settings.URL.ISBN + "/" + isbn;

        $http.get(url)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.reject({
                    text: isbn,
                    code: -1
                });
            }
        })
        .error(function() {
            deferred.reject({
                text: isbn,
                code: 0
            });
        });

        return deferred.promise;
    };

    self.scanISBN = function() {
        var deferred = $q.defer();
        $cordovaBarcodeScanner.scan().then(function(code) {
            if (self.isISBN(code.text)) {
                deferred.resolve(code.text);
                console.log('ISBN read:',code.text);
            }
            else {
                deferred.reject({
                    code: -1,
                    text: code.text
                });
                console.log('ISBN invalid:',code.text);
            }

        }, function(error) {
            deferred.reject({
                    code: 0,
                    text: 0
                });
            console.log('ISBN read:','invalid');
        });

        return deferred.promise;
    };


    self.like = function(book) {
        var type = book.is_like ? 'delete' : 'post';
        var deferred = $q.defer();
        $http[type](settings.URL.BOOK + "/" + book.id + '/like')
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve(book);
            }
        });
        return deferred.promise;
    };


    self.save = function(data) {
        var deferred = $q.defer();

        var action = data.id ? 'put' : 'post';
        var url = settings.URL.BOOK;
        if (action == 'put') {
            url = url + '/' + data.id;
        }

        $http[action](url, data)
        .success(function(response) {
            if (!response.errors) {
                response.data.author = autor(response.data.author);
                if (action == 'post') {
                    response.data.create = true;
                    $cordovaToast.showLongBottom(trans('book_form.toast_create'));
                    USER.updateAmountBook();
                }
                else {
                    response.data.update = true;
                    $cordovaToast.showLongBottom(trans('book_form.toast_update'));
                }
                $rootScope.$emit('book.refresh');
                $rootScope.$emit('book_shelf.refresh');
                deferred.resolve(response.data);
            }
            else {
                deferred.reject({
                    code: -1
                });
            }
        })
        .error(function() {
            deferred.reject({
                code: 0
            });
        });

        return deferred.promise;
    };

    self.recommend = function(book, friend) {

        var deferred = $q.defer();
        var post = {
            friend: friend
        }
        $http.post(settings.URL.BOOK + "/" + book.id + '/recommend',post)
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(true);
                $cordovaToast.showLongBottom(trans('recommend.toast_success'));
            }
            else {
                $cordovaToast.showLongBottom(trans('recommend.toast_failure'));
                deferred.resolve(false);
            }
        });
        return deferred.promise;
    }

    self.comment = function(book, message) {

        var deferred = $q.defer();
        $http.post(settings.URL.BOOK + "/" + book.id + '/comment',{
            message: message
        })
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        });
        return deferred.promise;
    }

    self.comments = function(book) {

        var deferred = $q.defer();
        $http.get(settings.URL.BOOK + "/" + book.id + '/comment')
        .success(function(response) {
            if (!response.errors) {
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        });
        return deferred.promise;
    }


    self.delete = function(book) {

        if (book.loaned) {
            $cordovaToast.showLongBottom(trans('book.toast_delete_loaned'));
            return;
        }
        $ionicPopup.confirm({
            title: trans('book.question_delete'),
            cancelText: trans('book.question_delete_no'),
            okText: trans('book.question_delete_yes'),
            template: book.title
        }).then(function(res) {
            if (res) {
                book.removed = true;
                $http.delete(settings.URL.BOOK + "/" + book.id)
                .success(function(response) {
                    $ionicLoading.hide();
                    if (!response.errors) {
                        $ionicHistory.clearCache();
                        $cordovaToast.showLongBottom(trans('book.toast_delete'));
                        $rootScope.$emit("book.refresh");
                        $rootScope.$emit('book_shelf.refresh');
                        $state.go('app.book');

                        USER.updateAmountBook(true);
                    }
                    else {
                        book.removed = false;
                        $ionicPopup.alert({
                            template: trans('book.toast_delete_loaned')
                        });
                    }
                })
                .error(function() {
                    $cordovaToast.showLongBottom(trans('book.toast_delete_failure'));
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
                response.data.author = autor(response.data.author);
                deferred.resolve(response.data);
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

    self.update = function(book) {
        $rootScope.bookUpdate = book;
        window.location = "#/app/book-form/" + book.id;
    };

    self.search = function(params) {
        params = params || {};

        params.sort = 'title';
        params.order = 'asc';
        var deferred = $q.defer();
        $http.get(settings.URL.ISBN + '/search', {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                angular.forEach(response.data, function(v) {
                    v.author = autor(v.author);
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

    function autor(v) {
        if (v && !(typeof v === 'string')) {
            return v.join(', ');
        }
        else {
            return v;
        }
    }


    self.all = function(params) {
        params = params || {};

        params.sort = 'title';
        params.order = 'asc';
        params.limit = 20;
        var deferred = $q.defer();
        $http.get(settings.URL.BOOK, {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                angular.forEach(response.data, function(v) {
                    v.author = autor(v.author);
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
                $cordovaToast.showLongBottom(trans('book.toast_request_return'));
                deferred.resolve();
            }
            else if (response.errors[0].code === 301) {
                $cordovaToast.showLongBottom(trans('book.toast_request_duplicate'));
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


    

    self.persistCover = function(book, cover) {
        var deferred = $q.defer();
        var post = {
            cover_source: cover
        };

        $http.put(settings.URL.BOOK + "/" + book.id, post)
        .success(function(response) {

            if (!response.errors) {
                $cordovaToast.showLongBottom(trans('book.toast_cover_update'));
                $rootScope.$emit("library.refresh");
                $rootScope.$emit("shelf.refresh");
                $rootScope.$emit("library.shelf.refresh");
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
                { text: "<i class=\"icon ion-android-camera\"></i> " + trans('book.sheet_photo') },
                { text: "<i class=\"icon ion-image\"></i> " + trans('book.sheet_picture')}
            ],
            titleText: trans('book.sheet_title') + book.title,
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
        event.stopPropagation();

        var options = [];

        options.push({ text: "<i class=\"icon ion-android-bookmark\"></i> " + trans('book.sheet_shelfs') });

        if (!book.is_ref) {
            options.push({ text: "<i class=\"icon ion-edit\"></i> " + trans('book.sheet_update') });
        }

        $ionicActionSheet.show({
            buttons: options,
            destructiveText: "<i class=\"icon ion-trash-a\"></i> " + trans('book.sheet_delete'),
            titleText: book.title,
            cancelText: trans('book.sheet_cancel'),
            destructiveButtonClicked: function() {
                self.delete(book);
                return true;
            },
            buttonClicked: function(index) {
                if (index === 1) {
                    self.update(book);
                }
                else if (index == 0) {
                    $rootScope.$emit("book.shelf", book);
                }
                return true;
            }
        });
    };

    return self;


}]);
