angular.module('starter.controllers')

.controller('recommendCtrl', function($scope, $rootScope, $filter, $timeout, $cordovaSocialSharing, BOOK,  FRIEND, settings) {

    var filterTextTimeout;

    var book = $scope.bookView;

    $scope.searching = false;
    $scope.friends = [];
    $scope.searchStart = false;

    var trans = $filter('translate');

    $scope.empty_list = trans('recommend.empty_list');
    $scope.empty_search = trans('recommend.empty_search');

    $scope.onSearch = function(input) {
        console.log('search');
        if (input.length < 3) {
            if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
            }
            return;
        }
        if (filterTextTimeout) {
            $timeout.cancel(filterTextTimeout);
        }

        filterTextTimeout = $timeout(function() {
            console.log(input);
            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.all({
                history: true,
                type: 'my',
                word: "%" + input + "%"
            }).then(function(data) {
                $scope.friends = data;
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        console.log('clean');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.word = '';
        }
        $scope.searching = false;
        $scope.friends = [];
        $scope.searchStart = false;
    };

    $scope.doRecommend = function(user) {
        console.log(user);

        BOOK.recommend(book, user.id)
        .then(function() {
            window.location = '#/app/book/' + book.id;
        });

    };

    $scope.doInvite = function() {

        var image = book.thumb;
        console.log(image);
        var name = $rootScope.user.fullname;
        var title = book.title;

        function convertImgToBase64URL(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                console.log('load');
                var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'), dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }

        convertImgToBase64URL(image, function(output) {
            console.log(output);
            $cordovaSocialSharing
            .share(String.format(trans('recommend.invite_msg'),name, title), String.format(trans('recommend.invite_subject'),name), output, trans('recommend.invite_link'))
            .then(function(result) {
              // Success!
            }, function(err) {
            });
        }, 'image/jpeg')
    };


});
