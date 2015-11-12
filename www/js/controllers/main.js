angular.module("livrio.controllers")
.controller("main_ctrl", function($scope, $ionicHistory, $rootScope, $http, $ionicModal, $ionicLoading, $ionicPopup, $cordovaToast, $filter, settings) {


    $ionicModal.fromTemplateUrl('templates/modal/terms.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalTerms = modal;
    });

    $scope.onCloseModalTerms = function() {
        $scope.modalTerms.hide();
    };

    $rootScope.$on("modal.terms",function() {
        $scope.modalTerms.show();
    });

    // document.addEventListener("backbutton", function() {
    //     console.log($state.current);
    //     if ($state.current && $state.current.name != 'app.library') {

    //     }
    //     console.log('backbutton');
    // }, false);

    var trans = $filter('translate');

    $rootScope.$on("loan.modal",function(e, book, success, failure) {
        console.log($scope);
        console.log('modal.loan');
        var values = [];

        for (var i = 1;i <= 10;i++) {
            values.push("<option value=\"" + i + "\">" + i + "</option>");
        }

        $scope.data =  {
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


        $ionicPopup.show({
            title: trans('loan.popup_title_2'),
            template: tpl.join(''),
            cssClass: 'popup-loan',
            scope: $scope,
            buttons: [
                {
                    text: trans('loan.popup_btn_cancel')
                },
                {
                    text: trans('loan.popup_btn_request'),
                    onTap: function(e) {


                        var duration = parseInt($scope.data.day,10) * parseInt($scope.data.type,10);
                        console.log(duration);
                        success(duration);
                        
                        return true;
                    }
                }
            ]
        }).then(function(res) {
            failure();
        });
    });


    $rootScope.$on("loan.add",function(e, item) {
        book = item;
        id = item.id;
        onRefresh();
        $scope.bookTitle = item.title;
    });

    $rootScope.$on("error.http",function(e) {
        $cordovaToast.showLongBottom("Você está offline!").then(function() {});
    });


});
