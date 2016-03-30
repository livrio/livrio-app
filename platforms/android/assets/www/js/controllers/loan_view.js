angular.module('livrio.controllers')

.controller('loan_view_ctrl', function($scope, $rootScope, $stateParams, $ionicScrollDelegate, $timeout, $interval, $ionicPopup, BOOK, LOAN) {

    var id = $stateParams.id;

    $scope.loading_book = true;

    var user_id = $rootScope.user._id


    $scope.activeTab = 0;

    $scope.user = {};
    $scope.friend  = {}

    $scope.address = 'Informe o local de entrega aqui.';


    LOAN.get(id)
    .then(function(data) {
        data._created = new Date(data._created);
        $scope.loaned = data;
        if (user_id == data['owner']['_id']) {
            $scope.user = data['owner'];
            $scope.friend = data['friend'];
        }
        else {
            $scope.user = data['friend'];
            $scope.friend = data['owner'];
        }

        $scope.friend.bg_cover = {
            'background-image': 'url(' + $scope.friend.cover + ')'
        };
        $scope.friend.bg_photo = {
            'background-image': 'url(' + $scope.friend.photo + ')'
        };

        if(data.address){
            $scope.address = data.address;
        }

        $scope.loading_book = false;
    });

    $scope.messages = [];

    var offset = 0;

    function loadMessages(reset) {
        LOAN.messages(id, offset)
        .then(function(data) {
            if (data.length == 0) {
                return;
            }
            if (reset) {
                $scope.messages = data
            }
            else {
                for (var i in data) {
                    $scope.messages.push(data[i]);
                }
            }
            scrollBottom();
            offset += data.length;
        })
    }



    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    function scrollBottom() {
        $timeout(function() {
            viewScroll.scrollBottom();
        }, 0);
    }

    $scope.$on('$ionicView.enter', function() {
        console.log('UserMessages $ionicView.enter');

        scrollBottom();

        $timeout(function() {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        loadMessages(true);

        messageCheckTimer = $interval(function() {
            console.log('check!!')
            // here you could check for new messages if your app doesn't use push notifications or user disabled them
            loadMessages();
        }, 5000);
    });

    $scope.$on('$ionicView.leave', function() {
        console.log('leaving UserMessages view, destroying interval');
        if (angular.isDefined(messageCheckTimer)) {
            $interval.cancel(messageCheckTimer);
            messageCheckTimer = undefined;
        }
    });

    $scope.$on('taResize', function(e, ta) {
        console.log('taResize');
        if (!ta) return;

        var taHeight = ta[0].offsetHeight;
        console.log('taHeight: ' + taHeight);

        console.log(footerBar)
        if (!footerBar) return;

        var newFooterHeight = taHeight + 25;
        newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

        footerBar.style.height = newFooterHeight + 'px';
        scroller.style.bottom = newFooterHeight + 'px';
    });

    function keepKeyboardOpen() {
        console.log('keepKeyboardOpen');
        txtInput.one('blur', function() {
            console.log('textarea blur, focus back on it');
            txtInput[0].focus();
        });
    }

    $scope.input = {
        message: ''
    };

    $scope.sendMessage = function(sendMessageForm) {
        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        keepKeyboardOpen();

        //MockService.sendMessage(message).then(function(data) {

        LOAN.createMessage(id, $scope.input.message)
        .then(function(message) {
            $scope.messages.push(message);
            offset += 1;
        });

        $scope.input.message = '';


        $timeout(function() {
            keepKeyboardOpen();
            viewScroll.scrollBottom(true);
        }, 0);

        $timeout(function() {
            //$scope.messages.push(MockService.getMockMessage());
            keepKeyboardOpen();
            viewScroll.scrollBottom(true);
        }, 2000);

        //});
    };


    $scope.onAction = function(status) {
        if (status == 'cancel') {
            $ionicPopup.prompt({
                title: 'Cancelar empréstimo',
                template: String.format('Você está cancelando o empréstimo do livro <strong>{0}</strong>. Informe o motivo do cancelamento para seu amigo.',$scope.loaned.book.title) + '<input ng-model="data.response" type="text" placeholder="Qual motivo?">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.changeStatus($scope.loaned._id, status, res)
                    .then(function(data) {
                        $scope.loaned.status = 'cancel';
                    });
                }
            });
        }
        else {
            LOAN.changeStatus($scope.loaned._id, status)
            .then(function(data) {
                $scope.loaned.status = status;
            });
        }
    }


    $scope.onUpdateAddress = function() {
        if ($scope.loaned.status == 'cancel'){
            return;
        }
        $ionicPopup.prompt({
                title: 'Local de entrega',
                template: 'Qual sua sugestão de local de entrega do livro? <input ng-model="data.response" type="text" placeholder="Digite aqui.">',
                cancelText: 'Cancelar',
                okText: 'OK'
            }).then(function(res) {
                if (res) {
                    LOAN.updateAddress(id, res);
                    $scope.address = res;
                }
            });
    };


});
//http://codepen.io/rossmartin/pen/XJmpQr
