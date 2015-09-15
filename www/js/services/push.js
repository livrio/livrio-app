angular.module('starter.services')
.factory('PUSH', ['$rootScope', '$http', '$q', '$filter', '$ionicUser', '$ionicPush',  '$interval', 'settings', function($rootScope, $http, $q, $filter, $ionicUser, $ionicPush, $interval, settings) {

    var self = this;

    var trans = $filter('translate');

    $rootScope.notifications = {
        unview: 0,
        unview_ids: [],
        list: []
    };

    $interval(function() {
        angular.forEach($rootScope.notifications.list, function(item) {
            item.date = $filter('dateparse')(new Date(item.registration));
        });
    }, 60000);



    function processNotice(item) {
        try {
            var text = '', href='';
            if (item.type === 'friend') {
                text = String.format(trans('notification.msg_friend'), item.created_by.fullname);
                href = "#/app/friend/" + item.created_by.id;

            }
            else if (item.type === 'loan_request') {
                text = String.format(trans('notification.msg_loan_request'), item.created_by.fullname, item.book.title);
                item.question = true;
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_confirm_yes') {
                item.question = true;
                text = String.format(trans('notification.msg_loan_confirm_yes'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_confirm_no') {
                text = String.format(trans('notification.msg_loan_confirm_no'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }
            }
            else if (item.type === 'loan_request_return') {
                text = String.format(trans('notification.msg_loan_request_return'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_return_confirm') {
                text = String.format(trans('notification.msg_loan_return_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_confirm') {
                text = String.format(trans('notification.msg_loan_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_confirm') {
                text = String.format(trans('notification.msg_loan_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_sent_canceled') {
                text = String.format(trans('notification.msg_loan_sent_canceled'), item.created_by.fullname, item.book.title);
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }

                href = "#/app/book/" + item.book.id;
            }
            else if (item.type === 'loan_sent_refused') {
                text = String.format(trans('notification.msg_loan_sent_refused'), item.created_by.fullname, item.book.title);
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }

                href = "#/app/book/" + item.book.id;
            }

            item.text = text;
            // item.registration = new Date();
            item.date = $filter('dateparse')(new Date(item.registration));
            item.photo = item.created_by.photo;
            item.unview = !item.view;
            item.unread = !item.read;
            item.href = href;
        }
        catch (e) {}
        return item;
    }

    function processAllNotice(data) {
        var arr = [], unview=0, ids=[];

        angular.forEach(data, function(item) {
            if (!item.view) {
                ids.push(item.id);
                unview++;
            }
            arr.push(processNotice(item));
        });

        return {
            unview: unview,
            unview_ids:ids,
            list: arr
        };
    }


    self.markView = function() {

        var deferred = $q.defer();
        $http.put(settings.URL.NOTIFICATION + "/view", {
            ids: $rootScope.notifications.unview_ids
        })
        .success(function(response) {
            if (!response.errors) {
                $rootScope.notifications.unview_ids=[];
                $rootScope.notifications.unview = 0;
                angular.forEach($rootScope.notifications.list, function(item) {
                    item.unview = false;
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

    self.markRead = function(item) {

        var deferred = $q.defer();
        $http.put(settings.URL.NOTIFICATION + "/" + item.id + "/read")
        .success(function(response) {
            if (!response.errors) {
                item.unread = false;
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
                deferred.resolve(response.data);
            }
            else {
                deferred.resolve([]);
            }
        })
        .error(function() {
            $rootScope.notifications = {
                unview: 0,
                unview_ids:[],
                list: []
            };
            deferred.resolve([]);
            console.log("TRATAR ERROR");
        });
        return deferred.promise;
    };

    function doUpdateToken(platform, token) {

        var post = {
            deviceToken: {
                platform: platform,
                token: token
            }
        };
        $http.put(settings.URL.USER + "/" + $rootScope.user.id, post)
        .success(function() {});
    };

    /**
    curl -u e777cc0ffe2634e969007579aa430968f5418ac96a9e4c05: -H "Content-Type: application/json" -H "X-Ionic-Application-Id: 857a12a1" https://push.ionic.io/api/v1/push -d '{"tokens":["APA91bEFLqNScXLqPMIA0QdF0MlWJmU4yQTU_Z-1bOeiLDyvyJZ9tFaksZUDYjfm4KZVbeqBJFFGXECBJjZVxCoViYhZxdH8A7BwVX22WdJ6UoatlBLkgtOzMxBiI4UFMQ377XVrxECL"],"notification":{"alert":"I come from planet Ion."}}'
    */
    self.register = function(userInfo) {

        $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
            console.log("Successfully registered token " + data.token);
            console.log('Ionic Push: Got token ', data.token, data.platform);
            doUpdateToken(data.platform,data.token);
        });


        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            console.log('$cordovaPush:notificationReceived');
            console.log(notification);
            switch (notification.event) {
                case 'message':
                    console.log(JSON.stringify(notification));
                    self.all();
                break;
            }
        });


        var user = $ionicUser.get();
        if (!user.user_id) {
            user.user_id = $ionicUser.generateGUID();
        };

        // Add some metadata to your user object.
        angular.extend(user, userInfo);

        // Identify your user with the Ionic User Service
        $ionicUser.identify(user).then(function() {
            console.log('Identified user ' + user.name + ' ID ' + user.user_id);

            $ionicPush.register({
                canShowAlert: true, //Can pushes show an alert on your screen?
                canSetBadge: true, //Can pushes update app icon badges?
                canPlaySound: true, //Can notifications play a sound?
                canRunActionsOnWake: true, //Can run actions outside the app,
                onNotification: function(notification) {
                    console.log('notification');
                    console.log(JSON.stringify(notification));
                    return true;
                }
            }).then(function(deviceToken, t) {
                console.log(deviceToken);
                console.log(t);
            },
            function() {
                console.log('error token');
            });

        });
    };

    return self;

}]);

