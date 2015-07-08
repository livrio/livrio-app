angular.module('starter.services')
.factory('PUSH', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$filter', 'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $filter, settings) {

    var self = this;

    $rootScope.notifications = {
        unread: 0,
        unread_ids: [],
        list: []
    };


    function processNotice(item) {
        var text = '', href='';
        if (item.type === 'friend') {
            text ='<strong>' + item.created_by.fullname + '</strong> entrou no <strong>Livrio.</strong>';
            href = "#/library-friend/" + item.created_by.id;

        }
        else if (item.type === 'loan_confirm') {
            text ='<strong>' + item.created_by.fullname + '</strong> disse que te emprestou o livro <strong>' + item.book.title + '</strong>';
            href = "#/library-view/" + item.book.id;
        }

        return {
                unread: !item.read,
                text: text,
                href: href,
                date: $filter('date')(new Date(item.registration), "d 'de' MMMM 'de' yyyy 'às' H:mm"),
                photo: item.created_by.photo
            };
    }

    function processAllNotice(data) {
        var arr = [], unread=0, ids=[];

        angular.forEach(data, function(item) {
            if (!item.read) {
                //ids.push(item.id);
                //unread++;
            }
            //arr.push(processNotice(item));
        });

        return {
            unread: unread,
            unread_ids:ids,
            list: arr
        };
    }


    self.markRead = function() {

        var deferred = $q.defer();
        $http.put(settings.URL.NOTIFICATION + "/read", {
            ids: $rootScope.notifications.unread_ids
        })
        .success(function(response) {
            if (!response.errors) {
                $rootScope.notifications.unread_ids=[];
                angular.forEach($rootScope.notifications.list, function(item) {
                    item.unread = false;
                });

                deferred.resolve(true);
            }
            else {
                deferred.resolve(false);
            }
        })
        .error(function() {
            deferred.resolve(false);
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    self.all = function(params) {
        params = params || {};

        params.sort = 'id';
        params.order = 'desc';
        var deferred = $q.defer();
        $http.get(settings.URL.NOTIFICATION, {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                $rootScope.notifications = processAllNotice(response.data);
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        })
        .error(function() {
            $rootScope.notifications = {
                unread: 0,
                unread_ids:[],
                list: []
            };
            deferred.resolve([]);
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };


    return self;

}]);
