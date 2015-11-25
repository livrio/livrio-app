angular.module('livrio.services')
.factory('PUSH', ['$rootScope', '$http', '$state', '$q', '$filter', '$interval', 'settings', function($rootScope, $http, $state, $q, $filter, $interval, settings) {

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

            if (item.type === 'system_first_book') {
                text = String.format(trans('notification.msg_system_first_book'), item.user.fullname);
                href = "#/app/friend-invite";
            }
            else if (item.type === 'info_text') {
                text = item.content.text ;
                href = "#";
                if (item.content.href) {
                    href = item.content.href;
                }
            }
            else if (item.type === 'system_welcome') {
                text = String.format(trans('notification.msg_system_welcome'), item.user.fullname);
                href = "#/app/book-add";
            }
            else if (item.type === 'system_updated') {
                text = item.content.text ;
            }
            else if (item.type === 'system_library_empty') {
                text = String.format(trans('notification.msg_system_library_empty'), item.user.fullname);
                href = "#/app/book-add";
            }
            else if (item.type === 'friend') {
                text = String.format(trans('notification.msg_friend'), item.created_by.fullname);
                href = "#/app/friend-profile/" + item.created_by.id;

            }
            else if (item.type === 'loan_request') {
                text = String.format(trans('notification.msg_loan_request'), item.created_by.fullname, item.book.title);
                item.question = true;
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'friend_like_book') {
                text = String.format(trans('notification.msg_friend_like_book'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
             else if (item.type === 'friend_recommend_book') {
                text = String.format(trans('notification.msg_friend_recommend_book'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_confirm_yes') {
                item.question = true;
                text = String.format(trans('notification.msg_loan_confirm_yes'), item.created_by.fullname, item.book.title);

                if (item.content.msg) {
                    text = text + ' &horbar; ' + item.content.msg ;
                }

                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_confirm_no') {
                text = String.format(trans('notification.msg_loan_confirm_no'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }
            }
            else if (item.type === 'loan_request_return') {
                text = String.format(trans('notification.msg_loan_request_return'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_return_confirm') {
                text = String.format(trans('notification.msg_loan_return_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_confirm') {
                text = String.format(trans('notification.msg_loan_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_confirm') {
                text = String.format(trans('notification.msg_loan_confirm'), item.created_by.fullname, item.book.title);
                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_sent_canceled') {
                text = String.format(trans('notification.msg_loan_sent_canceled'), item.created_by.fullname, item.book.title);
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }

                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'loan_sent_refused') {
                text = String.format(trans('notification.msg_loan_sent_refused'), item.created_by.fullname, item.book.title);
                if (item.content.reason) {
                    text = text + ' &horbar; ' + item.content.reason ;
                }

                href = "#/app/book-view/" + item.book.id;
            }
            else if (item.type === 'request_friend') {
                text = String.format(trans('notification.msg_request_friend'), item.created_by.fullname);

                href = "#/app/friend-profile/" + item.created_by.id;
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
        params.limit = 30;
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
        .success(function() {
            console.log('SAVE:SUCCESS');
        }).error(function() {
            console.log('SAVE:ERROR');
        });
    };

    self.register = function(save) {


        var pushObject = PushNotification.init({
            "android": {"senderID": "966956371758","iconColor":"#f9b000","icon":"notify","forceShow":"true","clearNotifications":"false"},
            "ios": {"alert": "true", "badge": "true", "sound": "true"}
        } );

        pushObject.on('registration', function(data) {
            console.log(data.registrationId);
            var device = ionic.Platform.isAndroid() ? 'android' : 'ios';
            if (save) {
                doUpdateToken(device,data.registrationId);
                console.log('SAVE');
            }
            else {
                console.log('SAVE:NO');
            }

            var tokenPUSH = {
                platform: device,
                token: data.registrationId
            };

            window.localStorage.pushToken = JSON.stringify(tokenPUSH);

        });

        if (save) {
            pushObject.on('notification', function(data) {
                self.all();
                console.log(JSON.stringify(data));

                if (!ionic.Platform.isAndroid()) {
                    pushObject.finish();
                }

                if (data.additionalData && data.additionalData.href) {
                    if (window.location.hash == data.additionalData.href) {
                        $rootScope.$emit('book.view.refresh');
                    }
                    else {
                        window.location = data.additionalData.href;
                    }
                }
                else if (data.additionalData && data.additionalData.update) {
                    if (ionic.Platform.isAndroid()) {
                        cordova.plugins.market.open('io.livr.app');
                    }
                }
                else {
                    self.markView();
                    window.location = '#/app/notification';
                }




            });

        }
    };

    return self;

}]);

