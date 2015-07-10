angular.module("starter.controllers")
.controller("mainCtrl", function($scope, $ionicHistory, $rootScope, $http, $ionicModal, $ionicLoading, $ionicPopup, settings) {


    $rootScope.$on("loan.modal",function(e, book, success, failure) {
        console.log($scope);
        console.log('modal.loan');
        var values = [];

        for (var i = 1;i <= 10;i++) {
            values.push("<option value=\"" + i + "\">" + i + "</option>");
        }

        $scope.loanDay = 1;
        $scope.loanType = 1;

        var tpl = [
            "<p>Quanto tempo você precisa?</p>",
            "<div class=\"duration\"><select ng-model=\"loanType\">",
                "<option value=\"1\">Dia",
                "<option value=\"7\">Semana",
                "<option value=\"30\">Mês",
            "</select>",

            "<select ng-model=\"loanDay\">",
                values.join(''),
            "</select></div>"

        ];


        $ionicPopup.show({
            title: "Solicitação de empréstimo",
            template: tpl.join(''),
            cssClass: 'popup-loan',
            scope: $scope,
            buttons: [
                { text: "não" },
                {
                    text: "Solicitar",
                    onTap: function(e) {
                        console.log(e);
                        console.log('aqui');
                        console.log($scope.loanDay, $scope.loanType);
                        var duration = parseInt($scope.day,10) * parseInt($scope.type,10);
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
        $scope.modal.show();
    });

    $rootScope.$on("error.http",function(e) {
        $ionicPopup.alert({
            template: "Error no servidor"
        }).then(function() {});
    });


});
