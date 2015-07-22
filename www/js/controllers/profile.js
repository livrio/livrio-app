"use strict";

angular.module('starter.controllers')
.controller('profileCtrl', function( $scope, $rootScope, $ionicActionSheet, $http, $cordovaToast, $cordovaCamera, $filter, settings) {

    var user = $rootScope.user;
    var trans = $filter('translate');

    console.log(user.birthday);
    user.birthday = new Date(user.birthday + " 23:59:59");
    console.log(user.birthday);
    $scope.form = user;


    var id = $rootScope.user.id;

    $scope.onSave = function() {
        $cordovaToast.showLongBottom(trans('profile.toast_save')).then(function() {});
    };

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

    function save(post) {

        var old = $scope.form.photo;
        if (post.avatar_source) {
            $scope.form.photo = 'data:image/jpeg;base64,' + post.avatar_source;
        }
        else {
            $scope.form.photo = 'img/avatar.png';
        }


        $http.put(settings.URL.USER + '/' + id, post)
        .success(function(response) {
            console.log(JSON.stringify(response));
            if (!response.errors) {
                window.localStorage.user = JSON.stringify(response.data);
                $rootScope.user = response.data;
            }
            else {
                $scope.form.photo = old;
                $cordovaToast.showLongBottom(trans('profile.toast_photo_error')).then(function() {});
            }
        })
        .error(function() {
            $scope.form.photo = old;
            console.log(JSON.stringify(arguments));
            console.error('TRATAR ERROR');
        });
    }


    var onPicture = function(index) {
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

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData);
            var post = {
                avatar_source: imageData
            };

            save(post);


        }, function(err) {
            console.log(JSON.stringify(arguments));
            console.error('TRATAR ERROR');
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
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
            });
        }
    };
});
