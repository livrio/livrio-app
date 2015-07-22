angular.module("starter.services")
.factory("SHELF", ["$rootScope", "$http", "$ionicHistory", "$state", "$q", "$ionicPopup", "$ionicLoading", "$cordovaToast", "$filter", "settings", "BOOK", function($rootScope, $http, $ionicHistory, $state, $q, $ionicPopup, $ionicLoading, $cordovaToast, $filter, settings, BOOK) {

    var self = this;

    var trans = $filter('translate');

    $rootScope.shelfs = [];


    self.add = function() {
        var deferred = $q.defer();
        $ionicPopup.prompt({
            title: trans('shelf.popup_create_title'),
            template: trans('shelf.popup_create_msg'),
            cancelText: trans('shelf.popup_create_cancel'),
            okText: trans('shelf.popup_create_ok')
        }).then(function(res) {
            console.log(res);
            if (res) {
                $http.post(settings.URL.SHELF, {
                    name: res
                })
                .success(function(response) {
                    if (!response.errors) {
                        $cordovaToast.showLongBottom(trans('shelf.toast_create')).then(function() {});
                        $rootScope.shelfs.push(response.data);
                        deferred.resolve(response.data);
                    }
                    else {
                        console.log('ERROR SHELF CREATE');
                        deferred.reject();
                    }
                })
                .error(function() {
                    console.log("TRATAR ERROR");
                    deferred.reject();
                });
            }
            else {
                deferred.reject();
            }
        });
        return deferred.promise;
    };

    self.update = function(book) {
        $ionicPopup.prompt({
            title: trans('shelf.popup_update_title'),
            template: trans('shelf.popup_update_msg'),
            cancelText: trans('shelf.popup_update_cancel'),
            okText: trans('shelf.popup_update_ok')
        }).then(function(res) {
            console.log(res);
            if (res) {
                create(res);
            }
        });
    };

    self.delete = function(shelf) {
        $ionicPopup.confirm({
            title: trans('shelf.popup_delete_title'),
            cancelText: trans('shelf.popup_delete_cancel'),
            okText: trans('shelf.popup_delete_ok'),
            template: trans('shelf.popup_delete_msg') + '<br /><strong>' + shelf.name + '</strong>'
        }).then(function(res) {
            if (res) {
                $http.delete(settings.URL.SHELF + "/" + shelf.id)
                .success(function(response) {
                    if (!response.errors) {
                        self.all();
                        $cordovaToast.showLongBottom(trans('shelf.toast_delete')).then(function() {});
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.library');
                    }
                    else {
                        console.log('EROOR DELETE');
                    }
                })
                .error(function() {
                    $ionicLoading.hide();
                    console.log("TRATAR ERROR");
                    $rootScope.$emit("error.http");
                });
            }
        });
    };

    self.getCache = function(id) {
        var result= {
            id: 0
        };
        angular.forEach(function(item) {
            if (id === item.id) {
                result = item;
                return false;
            }
        });

        return result;
    };

    self.books = function(id) {
        return BOOK.all({
            shelf: id || 0
        });
    };

    self.get = function(id) {
        var deferred = $q.defer();

        var shelf = self.getCache(id);

        if (shelf.id === 0) {
            $http.get(settings.URL.SHELF + "/" + id)
            .success(function(response) {
                if (!response.errors) {
                    deferred.resolve(response.data);
                }
                else {
                    console.log('ERROR SHELF CREATE');
                    deferred.reject();
                }
            })
            .error(function() {
                console.log("TRATAR ERROR");
            });
        }
        else {
            deferred.resolve(shelf);
        }


        return deferred.promise;
    }


    self.all = function() {
        var deferred = $q.defer();
        $http.get(settings.URL.SHELF)
        .success(function(response) {
            if (!response.errors) {
                $rootScope.shelfs = response.data;
                deferred.resolve(response.data);
            }
            else {
                console.log('ERROR SHELF CREATE');
            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    $rootScope.$on("shelf.refresh",function() {
        self.all();
    });


    return self;

}]);
