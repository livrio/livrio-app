"use strict";

angular.module('livrio.controllers')
.controller('profile_ctrl', function( $scope, $rootScope, $ionicSideMenuDelegate, $ionicActionSheet, $http, $cordovaToast, $cordovaCamera, $filter, settings) {

    var user = $rootScope.user;
    var trans = $filter('translate');

    user.birthday = new Date(user.birthday + " 23:59:59");
    $scope.form = user;

    $scope.onMenu = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };


    $scope.$watch('form.photo',function(n) {
        $scope.photo = {
            'background-image': 'url(' + n + ')'
        };
    });

    $scope.$watch('form.cover',function(n) {
        $scope.cover = {
            'background-image': 'url(' + n + ')'
        };
    });




    var id = $rootScope.user.id;


    $scope.onPicture = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-android-camera\"></i> " + trans('profile.sheet_photo') },
                { text: "<i class=\"icon ion-image\"></i> " + trans('profile.sheet_picture')}
            ],
            destructiveText: "<i class=\"icon ion-trash-a\"></i> " + trans('profile.sheet_remove'),
            titleText: trans('profile.sheet_title'),
            cancelText: trans('profile.sheet_cancel'),
            destructiveButtonClicked: function() {
                save({
                    photo_remove:  true
                });
                return true;
            },
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                onPicture(index);
                return true;
            }
        });
    };

    $scope.onCover = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-android-camera\"></i> " + trans('profile.sheet_photo') },
                { text: "<i class=\"icon ion-image\"></i> " + trans('profile.sheet_picture')}
                
            ],
            destructiveText: "<i class=\"icon ion-trash-a\"></i> " + trans('profile.sheet_remove'),
            titleText: trans('profile.sheet_title'),
            cancelText: trans('profile.sheet_cancel'),
            destructiveButtonClicked: function() {
                save({
                    cover_remove:  true
                });
                return true;
            },
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                onPicture(index, true);
                return true;
            }
        });
    };

    function save(post, cover) {

        var old = $scope.form.photo;
        var old2 = $scope.form.cover;
        if (post.avatar_source && !cover) {
            $scope.form.photo = 'data:image/jpeg;base64,' + post.avatar_source;
        }
        else if(!cover){
            $scope.form.photo = 'img/avatar.png';
        }
        else if (post.cover_source && cover) {
            $scope.form.cover = 'data:image/jpeg;base64,' + post.cover_source;
        }
        else if(cover){
            $scope.form.cover = 'img/cover.png';
        }


        $http.put(settings.URL.USER + '/' + id, post)
        .success(function(response) {
            if (!response.errors) {
                window.localStorage.user = JSON.stringify(response.data);
                $rootScope.user = response.data;
                $scope.form = $rootScope.user;
                $cordovaToast.showLongBottom(trans('profile.toast_save'));
            }
            else {
                $scope.form.photo = old;
                $scope.form.cover = old2;
                $cordovaToast.showLongBottom(trans('profile.toast_photo_error'));
            }
        })
        .error(function() {
            $scope.form.photo = old;
        });
    }


    var onPicture = function(index, cover) {
        var sourceType = index === 0 ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        if (cover) {
            delete options.targetWidth;
            delete options.targetHeight;
            delete options.popoverOptions;
        }

        $cordovaCamera.getPicture(options).then(function(imageData) {
            var post = {};
            if (cover) {
                post.cover_source = imageData;
            }
            else {
                post.avatar_source = imageData;
            }

            save(post, cover);


        });
    };

    $scope.onChangeField = function(field) {
        if (field.$valid) {
            var post = {};
            if (field.$name == 'birthday') {
                post[field.$name] = formatDate(field.$modelValue);
            }
            else {
                post[field.$name] = field.$modelValue;
            }


            $http.put(settings.URL.USER + '/' + id, post)
            .success(function(response) {
                window.localStorage.user = JSON.stringify(response.data);
                $rootScope.user = response.data;
                $cordovaToast.showLongBottom(trans('profile.toast_save'));
            });
        }
    };
});
