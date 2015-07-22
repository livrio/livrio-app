angular.module('starter.controllers')

.filter('dateparse', function($filter) {

    var trans = $filter('translate');
    
    function prettyDate(date) {
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

        if (day_diff == 0 && diff < 60){
            return trans('notification.time_now');
        }
        else if (day_diff == 0 && diff < 120) {
            return trans('notification.time_minute');
        }
        else if (day_diff == 0 && diff < 3600) {
            return String.format(trans('notification.time_n_minute'),Math.floor(diff / 60));
        }
        else if (day_diff == 0 && diff < 7200) {
            return String.format(trans('notification.time_hour'));
        }
        else if (day_diff == 0 && diff < 86400) {
            return String.format(trans('notification.time_n_hour'),Math.floor(diff / 3600));
        }
        else if (day_diff == 1) {//yesterday
            return String.format(trans('notification.time_yesterday'));
        }
        else if (day_diff < 7) {//yesterday
            return String.format(trans('notification.time_days'), day_diff);
        }
        else if (day_diff < 31) {//yesterday
            return String.format(trans('notification.time_week'), Math.ceil(day_diff / 7));
        }

    }

    return function(input) {
        console.log(input);
        return prettyDate(input);
    };
})

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, $filter, PUSH, FRIEND) {

    var trans = $filter('translate');
    $timeout(function() {
        PUSH.markView();
    },1000);

    $scope.onRefresh = function() {
        PUSH.all()
        .then(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };


    $scope.onAction = function(item) {
        PUSH.markRead(item);
        if (item.type == 'request_friend') {
            $ionicPopup.confirm({
                title: trans('notification.question_friend_title'),
                cancelText: trans('notification.question_friend_no'),
                okText: trans('notification.question_friend_yes'),
                template: String.format(trans('notification.question_friend_msg'), item.created_by.fullname)
            })
            .then(function(res) {
                 if (res) {
                     FRIEND.confirm(item, 'yes');
                 }
                 else {
                     FRIEND.confirm(item, 'no');
                 }
             });
        }
    }

});
