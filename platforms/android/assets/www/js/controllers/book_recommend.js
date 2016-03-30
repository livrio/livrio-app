angular.module('livrio.controllers')

.controller('book_recommend_ctrl', function($scope, $rootScope, $state, $filter, $timeout, $cordovaSocialSharing, BOOK,  FRIEND) {

    var filterTextTimeout;

    var book = $scope.bookView;

    $scope.searching = false;
    $scope.friends = [];
    $scope.searchStart = false;

    var trans = $filter('translate');

    $scope.empty_list = trans('recommend.empty_list');
    $scope.empty_search = trans('recommend.empty_search');

    $scope.onSearch = function(input) {
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
            $scope.searching = true;
            $scope.searchStart = true;
            FRIEND.all({
                history: true,
                type: 'my',
                word: "%" + input + "%"
            }).then(function(data) {
                $scope.friends = data;
                $scope.searching = false;
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
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
        BOOK.recommend(book, user._id)
        .then(function() {
            $state.go('app.book-view',{
                id: book._id
            });
        });

    };

    $scope.doInvite = function() {

        var image = book.thumb;
        var name = $rootScope.user.fullname;
        var title = book.title;

        if (image.indexOf('cover.gif') === -1 ) {

            convertImgToBase64URL(image, function(output) {
                $cordovaSocialSharing
                .share(String.format(trans('recommend.invite_msg'),name, title), String.format(trans('recommend.invite_subject'),name), output, trans('recommend.invite_link'))
                .then(function(result) {
                    $cordovaToast.showLongBottom(trans('recommend.toast_success'));
                }, function(err) {
                    $cordovaToast.showLongBottom(trans('recommend.toast_failure'));
                });
            }, 'image/jpeg');

        } else {
            $cordovaSocialSharing
            .share(String.format(trans('recommend.invite_msg'),name, title), String.format(trans('recommend.invite_subject'),name), null, trans('recommend.invite_link'))
            .then(function(result) {
                $cordovaToast.showLongBottom(trans('recommend.toast_success'));
            }, function(err) {
                $cordovaToast.showLongBottom(trans('recommend.toast_failure'));
            });
        }
    };


});
