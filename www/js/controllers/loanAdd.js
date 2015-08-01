angular.module('starter.controllers')

.controller('loanAddCtrl', function($scope, $rootScope, $ionicHistory, $http, $ionicPopup, $filter,  FRIEND, LOAN, settings) {

    var trans = $filter('translate');
    var book = $rootScope.bookView;
    $scope.loading = true;

    $scope.loadText = trans('loading');

    $scope.friends = [];

    $scope.onRefresh = function() {
        FRIEND.all()
        .then(function(data) {
            $scope.friends = data;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
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

    $scope.onRefresh();
});
