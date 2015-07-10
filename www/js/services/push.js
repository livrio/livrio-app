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
            text ='<strong>' + item.created_by.fullname + '</strong> solicitou empréstimo do livro <strong>' + item.book.title + '</strong>';
            item.question = true;
            href = "#/app/book/" + item.book.id;
        }
        else if (item.type === 'loan_confirm_yes') {
            item.question = true;
            text ='<strong>' + item.created_by.fullname + '</strong> já entregou o livro <strong>' + item.book.title + '</strong>';
            href = "#/app/book/" + item.book.id;
        }
        else if (item.type === 'loan_confirm_no') {
            text ='<strong>' + item.created_by.fullname + '</strong> não quis emprestar o livro <strong>' + item.book.title + '</strong>';
            href = "#/app/book/" + item.book.id;
        }

        item.text = text;
        item.date = $filter('date')(new Date(item.registration), "d 'de' MMMM 'de' yyyy 'às' H:mm");
        item.photo = item.created_by.photo;
        item.unread = !item.read;
        item.href = href;
        return item;
    }

    function processAllNotice(data) {
        var arr = [], unread=0, ids=[];

        angular.forEach(data, function(item) {
            if (!item.read) {
                //ids.push(item.id);
                unread++;
            }
            arr.push(processNotice(item));
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


    self.get = function(id) {
        var list = $rootScope.notifications.list;
        console.log(list);
        for (var i=0;i < list.length;i++) {
            if (id == list[i].id) {
                return list[i];
            }
        }
        return false;
    };


    self.all = function(params) {
        params = params || {};

        params.sort = 'registration';
        params.order = 'desc';
        var deferred = $q.defer();
        $http.get(settings.URL.NOTIFICATION, {
            params: params
        })
        .success(function(response) {
            if (!response.errors) {
                $rootScope.notifications = processAllNotice(response.data);
                console.log($rootScope.notifications);
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
