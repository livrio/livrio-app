angular.module("starter.controllers")
.controller("mainCtrl", function($scope, $rootScope, $http, $ionicModal, $ionicLoading, $ionicPopup, settings) {


    var id = 0, book;
    $ionicModal.fromTemplateUrl("templates/emprestimo.html", {
        scope: $scope,
        animation: "slide-in-up"
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.friends = [];


    var onRefresh = function() {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.FRIEND)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                $scope.friends = [];
                angular.forEach(response.data, function(item) {
                    if (!item.thumb) {
                        item.thumb = "img/avatar.png?";
                    }
                    $scope.friends.push(item);
                });
            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.log("TRATAR ERROR");
        });
    };


    function onLoan(user, day) {
        $ionicLoading.show({
            template: "Emprestando..."
        });
        var post = {
            user: user,
            day: day || 1
        };
        $http.put(settings.URL.BOOK + "/" + id + "/loan",post)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                console.log("Emprestado");
                $scope.modal.hide();
                book.title = "EDITADO";
            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.log("TRATAR ERROR");
        });
    }


    $scope.showPopup = function(user) {
        var duration = [{
            day: 1,
            text:"1 dia"
        },
        {
            day: 2,
            text:"2 dias"
        },
        {
            day: 3,
            text:"3 dias"
        },
        {
            day: 4,
            text:"4 dias"
        },
        {
            day: 5,
            text:"5 dias"
        },
        {
            day: 6,
            text:"6 dias"
        },
        {
            day: 7,
            text:"1 semana"
        },
        {
            day: 14,
            text:"2 semanas"
        }];

        var values = [];

        angular.forEach(duration, function(item) {
            values.push("<option value=\"" + item.day + "\">" + item.text + "</option>");
        });

        $scope.day = 1;

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: "<label class=\"item item-input item-select\"><div class=\"input-label\">Duração</div><select ng-model=\"day\">" + values.join("") + "</select></label>",
            title: "Duração do emprestimo",
            subTitle: "Quantos dias seu amigo precisa?",
            scope: $scope,
            buttons: [
                { text: "Cancelar" },
                {
                    text: "<b>Emprestar</b>",
                    type: "button-positive",
                    onTap: function(e) {
                        onLoan(user.id, $scope.day);
                    }
                }
            ]
        });
        myPopup.then(function(res) {});
    };

    $rootScope.$on("loan.add",function(e, item) {
        book = item;
        id = item.id;
        onRefresh();
        $scope.modal.show();
    });
});
