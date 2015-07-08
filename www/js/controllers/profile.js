"use strict";

angular.module('starter.controllers')
.controller('profileCtrl', function( $scope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $rootScope, $ionicActionSheet, $ionicHistory, $http, $ionicPopup, $ionicLoading, settings, $cordovaToast, $cordovaCamera) {

    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    $scope.form = $rootScope.user;


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

            $http.put(settings.URL.USER + '/' + id, post)
            .success(function(response) {
                if (!response.errors) {
                    $scope.image = 'data:image/jpeg;base64,' + imageData;
                    $rootScope.user = response.data;
                }
                else {
                    $cordovaToast.showLongBottom('Não foi possível alterar a foto.').then(function() {});
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                console.error('TRATAR ERROR');
            });

        }, function(err) {
            console.log(JSON.stringify(arguments));
            console.error('TRATAR ERROR');
        });
    };

    $scope.doUpdate = function(isValid) {
        console.log('doUpdate');
        if (isValid) {
            $ionicLoading.show({
                template: 'Salvando...'
            });

            var post = {
                fullname: $scope.form.fullname,
                email: $scope.form.email
            };



            $http.put(settings.URL.USER + '/' + id, post)
            .success(function(response) {
                $ionicLoading.hide();
                if ( !response.errors) {
                    window.localStorage.user = JSON.stringify(response.data);
                    $cordovaToast.showLongBottom('Dados atualizados!').then(function() {});
                }
                else {

                    $ionicPopup.alert({
                        template: 'O email <strong>' + ($scope.form.email) + '</strong> já está sendo utilizado por outro usuário!'
                    }).then(function() {});
                    console.error('TRATAR ERROR');
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                $ionicLoading.hide();
                console.error('TRATAR ERROR');
            });

        }
    };

    $scope.onSubmit = function(form) {
        console.log(form);
    };
});
