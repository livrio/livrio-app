"use strict";

angular.module('starter.controllers')
.controller('profileCtrl', function( $scope, $rootScope, $ionicActionSheet, $http, $cordovaToast, $cordovaCamera, settings) {

    var user = $rootScope.user;

    console.log(user.birthday);
    user.birthday = new Date(user.birthday + " 23:59:59");
    console.log(user.birthday);
    $scope.form = user;


    var id = $rootScope.user.id;

    $scope.onPicture = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-android-camera\"></i> Tirar foto" },
                { text: "<i class=\"icon ion-image\"></i> Galeria"}
            ],
            titleText: 'Foto de perfil',
            cancelText: 'Cancelar',
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
            var old = $scope.form.photo;
            $scope.form.photo = 'data:image/jpeg;base64,' + imageData;

            $http.put(settings.URL.USER + '/' + id, post)
            .success(function(response) {
                console.log(JSON.stringify(response));
                if (!response.errors) {
                    window.localStorage.user = JSON.stringify(response.data);
                    $rootScope.user = response.data;
                }
                else {
                    $scope.form.photo = old;
                    $cordovaToast.showLongBottom('Não foi possível alterar a foto.').then(function() {});
                }
            })
            .error(function() {
                $scope.form.photo = old;
                console.log(JSON.stringify(arguments));
                console.error('TRATAR ERROR');
            });

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
