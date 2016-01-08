
angular.module("livrio.controllers")

.controller("book_form_ctrl", function($scope, $stateParams, $rootScope, $cordovaCamera, $ionicActionSheet, $filter, settings, BOOK) {

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
                id: id || false,
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
                    $rootScope.$emit("book.refresh");
                    window.location = '#/app/book';
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
                { text: "<i class=\"icon ion-android-camera\"></i> " + trans('book_form.sheet_photo') },
                { text: "<i class=\"icon ion-image\"></i> " + trans('book_form.sheet_picture')}
            ],
            cancelText: trans('book_form.sheet_cancel'),
            titleText: trans('book_form.sheet_title') + ' ' + $scope.form.title,
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
            $scope.form.thumb = 'data:image/jpeg;base64,' + imageData;
            $scope.form.cover_source = imageData;
        });
    };


});
