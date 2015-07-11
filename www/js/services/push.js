angular.module('starter.services')
.factory('PUSH', ['$rootScope', '$http', '$q', '$ionicPopup', '$ionicLoading', '$filter', '$ionicUser', '$ionicPush', 'settings', function($rootScope, $http, $q, $ionicPopup, $ionicLoading, $filter, $ionicUser, $ionicPush, settings) {

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

    self.test = function(token) {
        var appId = '857a12a1';
        var auth = btoa('e777cc0ffe2634e969007579aa430968f5418ac96a9e4c05:'); // Base64 encode your key
        var req = {
            method: 'POST',
            url: 'https://push.ionic.io/api/v1/push',
            headers: {
                'Content-Type': 'application/json',
                'X-Ionic-Application-Id': appId,
                'Authorization': 'basic ' + auth
            },
            data: {
                "tokens": [token],
                "notification": {
                "alert":"Hello World!"
            }
            }
        };
        $http(req).success(function(resp) {
            console.log("Ionic Push: Push success!");
        })
        .error(function(error) {
            console.log("Ionic Push: Push error...");
        });
    }


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

/**
        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            console.log(JSON.stringify(notification));
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });
*/

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
                    console.log(JSON.stringify(notification));
                    return true;
                }
            }).then(function(deviceToken, t) {
                console.log(deviceToken);
                console.log(t);
              
            },
            function(){
                console.log('error token');
            });

        });
    };

    


    return self;

}]);
