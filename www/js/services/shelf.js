angular.module("livrio.services")
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
                $http.post( toRouter('/shelves'), {
                    name: res
                })
                .success(function(response) {
                    if (response._status == 'OK') {
                        $cordovaToast.showLongBottom(trans('shelf.toast_create'));
                        $rootScope.shelfs.push(response);
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error(function() {
                    deferred.reject();
                });
            }
            else {
                deferred.reject();
            }
        });
        return deferred.promise;
    };

    self.update = function(shelf) {
        var deferred = $q.defer();
        $ionicPopup.prompt({
            title: trans('shelf.popup_update_title'),
            template: String.format(trans('shelf.popup_update_msg'), shelf.name) + '<input ng-model="data.response" type="text" placeholder="" class="ng-pristine ng-valid ng-touched">',
            cancelText: trans('shelf.popup_update_cancel'),
            okText: trans('shelf.popup_update_ok')
        }).then(function(res) {

            if (res) {
                console.log(shelf);
                $http.patch( toRouter('/shelves/{0}', shelf._id), {
                    name: res
                })
                .success(function(response) {
                    if (response._status == 'OK') {
                        $cordovaToast.showLongBottom(trans('shelf.toast_update'));
                        shelf.name = response.name;
                        self.all();
                        deferred.resolve(response.data);
                    }
                    else {
                        deferred.reject();
                    }
                })
                .error(function() {
                    deferred.reject();
                });
            }
            else {
                deferred.reject();
            }
        });
        return deferred.promise;
    };

    self.delete = function(shelf) {
        $ionicPopup.confirm({
            title: trans('shelf.popup_delete_title'),
            cancelText: trans('shelf.popup_delete_cancel'),
            okText: trans('shelf.popup_delete_ok'),
            template: trans('shelf.popup_delete_msg') + '<br /><strong>' + shelf.name + '</strong>'
        }).then(function(res) {
            if (res) {
                $http.delete( toRouter('/shelves/{0}', shelf._id))
                .success(function(response) {
                    self.all();
                    $cordovaToast.showLongBottom(trans('shelf.toast_delete'));
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.book');
                    
                })
                .error(function() {
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
            if (id === item._id) {
                result = item;
                return false;
            }
        });

        return result;
    };

    self.books = function(id) {
        return BOOK.all({
            shelves: [id] || []
        });
    };

    self.get = function(id) {
        var deferred = $q.defer();

        $http.get(toRouter('/shelves/{0}', id))
        .success(function(response) {
            deferred.resolve(response);

        })
        .error(function() {
            console.log("TRATAR ERROR");
        });



        return deferred.promise;
    }


    self.all = function() {
        var deferred = $q.defer();
        $http.get(toRouter('/shelves'))
        .success(function(response) {
            response._items = response._items || []
            $rootScope.shelfs = response._items;
            deferred.resolve(response._items);
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
