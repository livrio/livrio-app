
angular.module("starter.controllers")

.controller("bookFormCtrl", function($scope, $stateParams, $rootScope, $cordovaCamera, $ionicActionSheet, $filter, settings,  BOOK) {

    var id = $stateParams.id;

    var trans = $filter('translate');

    if (!id) {
        $scope.form = {
            isbn: "",
            title: "",
            author: "",
            thumb: "img/cover.gif",
            shelfs: [],
            config: {}
        };

        $scope.title = trans('book_form.title_create');
    }
    else {
        var updateBook = angular.copy($rootScope.bookUpdate);
        $scope.form = updateBook;
        $scope.title = trans('book_form.title_update');
    }


    $scope.doSave = function(form) {
        if (form.$valid) {
            var post = {
                isbn: $scope.form.isbn,
                title: $scope.form.title,
                author: $scope.form.author,
                cover_source: $scope.form.cover_source,
                publisher: $scope.form.publisher,
                published_year: $scope.form.published_year,
                page_count: $scope.form.page_count
            };

            BOOK.save(post)
            .then(function(book) {
                if (book.create) {
                    $rootScope.$emit("book.add",book);
                }
                else {

                }
            },
            function(o) {
                if (o.code == -1) {
                    $ionicPopup.alert({
                        template: trans('book_form.isbn_duplicate_notice')
                    });
                }
            });


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


});
