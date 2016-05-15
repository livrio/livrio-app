angular.module('livrio.controllers')

.controller('book_lend_ctrl', function($scope, $state, $rootScope, $ionicPopup, $timeout, $cordovaSocialSharing, $cordovaToast, $filter, FRIEND, LOAN) {

    var trans = $filter('translate');
    var book = $rootScope.bookView;
    var filterTextTimeout;

    $scope.searching = false;
    $scope.friends = [];
    $scope.searchStart = false;

    $scope.empty_list = trans('lend.empty_list');
    $scope.empty_search = trans('lend.empty_search');

    $scope.onSearch = function(input) {

        if (input.length < 3) {
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            return;
        }
        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {

            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.all({
                history: true,
                type: 'my',
                word: "%" + input + "%"
            }).then(function(data) {
                $scope.friends = data;
                $scope.searching = false;
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {

        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.word = '';
        }
        $scope.searching = false;
        $scope.friends = [];
        $scope.searchStart = false;
    };

    $scope.doLoan = function(user) {

        var values = [];

        for (var i = 1;i <= 10;i++) {
            values.push("<option value=\"" + i + "\">" + i + "</option>");
        }

        $scope.data = {
            day: 1,
            type: 1
        };


        var tpl = [
            "<div class=\"duration\"><select ng-model=\"data.type\">",
                "<option value=\"1\">",trans('lend.option_day'),
                "<option value=\"7\">",trans('lend.option_week'),
                "<option value=\"30\">",trans('lend.option_month'),
            "</select>",

            "<select ng-model=\"data.day\">",
                values.join(''),
            "</select></div>"

        ];

        $ionicPopup.show({
            title: trans('lend.popup_title'),
            template: tpl.join(''),
            cssClass: 'popup-loan',
            scope: $scope,
            buttons: [
                {
                    text: trans('lend.popup_btn_cancel')
                },
                {
                    text: trans('lend.popup_btn_ok'),
                    onTap: function(e) {
                        var days = parseInt($scope.data.day,10) * parseInt($scope.data.type,10);

                        LOAN.add(book._id, user._id, days,'sent')
                        .then(function(data) {
                            $rootScope.bookView.loaned = data.loaned;
                            $cordovaToast.showLongBottom(trans('lend.toast_success'));
                            window.location = '#/app/loan/' + data._id
                        },
                        function() {
                            $cordovaToast.showLongBottom(trans('lend.toast_failure'));
                        });

                    }
                }
            ]
        });
    };

    $scope.doInvite = function() {

        var image = book.thumb;
        var name = $rootScope.user.fullname;
        var title = book.title;

        function convertImgToBase64URL(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'), dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }

        convertImgToBase64URL(image, function(output) {

            $cordovaSocialSharing
            .share(String.format(trans('lend.invite_msg'),name, title), String.format(trans('lend.invite_subject'),name), output, trans('lend.invite_link'))
            .then(function(result) {
                $cordovaToast.showLongBottom(trans('lend.toast_external_success'));
            }, function(err) {
                $cordovaToast.showLongBottom(trans('lend.toast_failure'));
            });
        }, 'image/jpeg')
    };

});
