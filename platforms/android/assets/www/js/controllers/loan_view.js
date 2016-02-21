angular.module('livrio.controllers')

.controller('loan_view_ctrl', function($scope, $rootScope, $stateParams, $ionicScrollDelegate, $timeout, $interval,  BOOK, LOAN) {

    var id = $stateParams.id;

    $scope.loading_book = true;

    id = '56bd44b7f387bc212b83b524'

    $scope.activeTab = 0;

    BOOK.view(id)
    .then(function(data) {
        $scope.book = data;
        $scope.loading_book = false;
    });

    $scope.toUser = {
      _id: '534b8e5aaa5e7afc1b23e69b',
      pic: 'http://ionicframework.com/img/docs/venkman.jpg',
      username: 'Venkman'
    }

    // this could be on $rootScope rather than in $stateParams
    $scope.user = {
      _id: '534b8fb2aa5e7afc1b23e69c',
      pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
      username: 'Marty'
    };


    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

    $scope.$on('$ionicView.enter', function() {
        console.log('UserMessages $ionicView.enter');

        $timeout(function() {
            footerBar = document.body.querySelector('#userMessagesView .bar-footer');
            scroller = document.body.querySelector('#userMessagesView .scroll');
            txtInput = angular.element(footerBar.querySelector('textarea'));
    }, 0);

    messageCheckTimer = $interval(function() {
    // here you could check for new messages if your app doesn't use push notifications or user disabled them
    }, 20000);
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
        var message = {
            toId: $scope.toUser._id,
            text: $scope.input.message
        };

        // if you do a web service call this will be needed as well as before the viewScroll calls
        // you can't see the effect of this in the browser it needs to be used on a real device
        // for some reason the one time blur event is not firing in the browser but does on devices
        keepKeyboardOpen();

        //MockService.sendMessage(message).then(function(data) {
        $scope.input.message = '';

        message._id = new Date().getTime(); // :~)
        message.date = new Date();
        message.username = $scope.user.username;
        message.userId = $scope.user._id;
        message.pic = $scope.user.picture;

        $scope.messages.push(message);

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


    msgs = []
    msgs.push({
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'AAAAAAAAAAA'
    });
    msgs.push({
        userId: '534b8fb2aa5e7afc1b23e69c',
        date: new Date(),
        text: 'BBBBB'
    });
    msgs.push({
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'Expression to evaluate when a scroll action completes. Has access to scrollLeft and scrollTop locals.\n\nExpression to evaluate when a scroll action completes. Has access to scrollLeft and scrollTop locals.'
    });
    msgs.push({
        userId: '534b8fb2aa5e7afc1b23e69c',
        date: new Date(),
        text: 'DDDD'
    });

    msgs.push({
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'AAAAAAAAAAA'
    });
    msgs.push({
        userId: '534b8fb2aa5e7afc1b23e69c',
        date: new Date(),
        text: 'BBBBB'
    });
    msgs.push({
        userId: '534b8e5aaa5e7afc1b23e69b',
        date: new Date(),
        text: 'CCCCCCCC'
    });
    msgs.push({
        userId: '534b8fb2aa5e7afc1b23e69c',
        date: new Date(),
        text: 'DDDD'
    });


    $scope.messages = msgs


});
