angular.module('livrio.controllers')

.filter('dateparse', function($filter) {

    var trans = $filter('translate');

    function prettyDate(date) {
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

        if (day_diff == 0 && diff < 60) {
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
        return prettyDate(input);
    };
})
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])
.filter('concat', ['$filter',
  function($filter) {
    return function(v) {
      if (v && !(typeof v === 'string')) {
            return v.join(', ');
        }
        else {
            return v;
        }
    };
  }
])

.controller('notification_ctrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, $filter, PUSH, FRIEND) {

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

        if (item.type == 'system_update') {
            if (ionic.Platform.isAndroid()) {
                cordova.plugins.market.open('io.livr.app');
            }
        }
    }

    $scope.$on('$ionicView.enter', function() {
        console.log('Notifications $ionicView.enter');
        $scope.onRefresh();
    });

});
