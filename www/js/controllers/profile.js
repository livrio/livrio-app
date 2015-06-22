"use strict";

angular.module('starter.controllers')
.controller('profileCtrl', function( $scope, $rootScope, $ionicActionSheet, $ionicHistory, $http, $ionicPopup, $ionicLoading, settings, $cordovaToast, $cordovaCamera) {



    $scope.form = $rootScope.user;


    var id = $rootScope.user.id;

    $scope.onPicture = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Camera' },
                { text: 'Galeria' }
            ],
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
            targetWidth: 150,
            targetHeight: 150,
            correctOrientation: true,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $ionicLoading.show({
                template: 'Salvando foto...'
            });
            console.log(imageData);
            var post = {
                avatar_source: imageData
            };

            $http.put(settings.URL.USER + '/' + id, post)
            .success(function(response) {
                $ionicLoading.hide();
                if (!response.errors) {
                    $scope.image = 'data:image/jpeg;base64,' + imageData;
                }
                else {
                    $cordovaToast.showLongBottom('Não foi possível alterar a foto.').then(function() {});
                }
            })
            .error(function() {
                console.log(JSON.stringify(arguments));
                $ionicLoading.hide();
                console.error('TRATAR ERROR');
            });

        }, function(err) {
            console.log(JSON.stringify(arguments));
            $ionicLoading.hide();
            console.error('TRATAR ERROR');
        });
    };

    $scope.doUpdate = function(isValid) {
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

    $scope.onBack = function() {
        $ionicHistory.goBack();
    };
});
