angular.module('starter.controllers')

.controller('loanAddCtrl', function($scope, $rootScope, $ionicPopup, $timeout, $cordovaSocialSharing, $filter,  FRIEND, LOAN, settings) {

    var trans = $filter('translate');
    var book = $rootScope.bookView;
    var filterTextTimeout;

    $scope.loadText = trans('loading');

    $scope.searching = false;
    $scope.friends = [];
    $scope.searchStart = false;

    $scope.empty_list = trans('loaned.empty_list');
    $scope.empty_search = trans('loaned.empty_search');

    $scope.onSearch = function(input) {
        console.log('search');
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
            console.log(input);
            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.all({
                history: true,
                type: 'my',
                word: "%" + input + "%"
            }).then(function(data) {
                $scope.friends = data;
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        console.log('clean');
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
                "<option value=\"1\">",trans('loan.option_day'),
                "<option value=\"7\">",trans('loan.option_week'),
                "<option value=\"30\">",trans('loan.option_month'),
            "</select>",

            "<select ng-model=\"data.day\">",
                values.join(''),
            "</select></div>"

        ];

        // An elaborate, custom popup
        $ionicPopup.show({
            title: trans('loan.popup_title'),
            template: tpl.join(''),
            cssClass: 'popup-loan',
            scope: $scope,
            buttons: [
                {
                    text: trans('loan.popup_btn_cancel')
                },
                {
                    text: trans('loan.popup_btn_ok'),
                    onTap: function(e) {
                        var days = parseInt($scope.data.day,10) * parseInt($scope.data.type,10);

                        $scope.loadText = trans('loan.loading_loan');
                        $scope.loading = true;

                        LOAN.add(book.id, user.id, days,'sent')
                        .then(function(book) {
                            $scope.loading = false;
                            $scope.loadText = trans('loading');
                            $rootScope.bookView.loaned = book.loaned;
                            window.location = '#/app/book/' + book.id;
                        },
                        function() {
                            $scope.loading = false;
                            $scope.loadText = trans('loading');
                        });

                    }
                }
            ]
        }).then(function(res) {});
    };

    $scope.doInvite = function() {

        var image = book.thumb;
        console.log(image);
        var name = $rootScope.user.fullname;
        var title = book.title;

        function convertImgToBase64URL(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                console.log('load');
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
            console.log(output);
            $cordovaSocialSharing
            .share(String.format(trans('loaned.invite_msg'),name, title), String.format(trans('loaned.invite_subject'),name), output, trans('loaned.invite_link'))
            .then(function(result) {
              // Success!
            }, function(err) {
            });
        }, 'image/jpeg')
    };

    
});
