angular.module("starter.controllers")

.controller("libraryCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $ionicActionSheet, settings) {


    $scope.librarys = [];


    $scope.onRefresh = function() {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.BOOK)
        .success(function(response) {
            $ionicLoading.hide();
            if (!response.errors) {
                var library = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author[0];//.author.join(", ");
                    if (!item.thumb) {
                        item.thumb = "img/cover.gif?";
                    }
                    library.push(item);
                });

                $scope.librarys = columnize(library, 2);

            }
        })
        .error(function() {
            $ionicLoading.hide();
            console.log("TRATAR ERROR");
        });
    };


    $scope.onBook = function(item) {
        $ionicLoading.show({
            template: "Carregando..."
        });
        $http.get(settings.URL.BOOK + "/" + item.id)
        .success(function(response) {
            $ionicLoading.hide();
            $rootScope.bookView = response.data;
            window.location = "#/library-view/" + item.id;
        })
        .error(function() {
            $ionicLoading.hide();
        });
    };


    $scope.onActionBook = function(event, item) {
        event.stopPropagation();

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: "<i class=\"icon ion-edit\"></i> Editar" },
                { text: "<i class=\"icon ion-shuffle\"></i> Emprestar" }
            ],
            destructiveText: "<i class=\"icon ion-trash-a\"></i> Excluir",
            titleText: item.title,
            cancelText: "Cancelar",
            destructiveButtonClicked: function() {
                return true;
            },
            buttonClicked: function(index) {

                if (index === 1) {
                    $rootScope.$emit("loan.add",item);
                }
                return true;
            }
        });

    };

    $scope.onRefresh();


    $rootScope.$on("library.refresh",function() {
        $scope.onRefresh();
    });

});
