angular.module('starter.controllers')

.controller('friendAddCtrl', function($scope, $ionicHistory, $timeout, $filter,  $ionicPopup, $ionicScrollDelegate, FRIEND) {

    var trans = $filter('translate');

    $scope.empty_list = trans('add_friend.empty_list');
    $scope.empty_list_search = trans('add_friend.empty_list_search');

    $scope.activeTab = 0;
    $scope.word = '';
    var scroll = true;
/*
    $ionicPopup.confirm({
        title: 'Acesso aos contatos',
        cancelText:'Não, Obrigado!',
        okText: 'OK',
        template: 'Veja quem está no Livrio carregando seus contatos. Depois, fale para nós quem você quer adicionar como amigo.<br/ ><br /><small>As informações sobre os contatos da sua agenda, incluindo nomes, números de telefone e emails, serão enviadas ao Livrio para ajudar você e outras pessoas a encontrar amigos mais rapidamente e nos ajudar a aumentar a qualidade do nosso serviço.</small>'
    }).then(function(res) {

    });
*/

    function load() {
        FRIEND.all(params).then(function(data) {
            if (data.length == 0) {
                scroll = false;
            }
            angular.forEach(data, function(v) {
                $scope.friendsResult.push(v);
            });
            $ionicScrollDelegate.resize();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    var params = {};

    $scope.onChangeTab = function(form, tab) {

        $scope.activeTab = tab;
        if (tab == 0) { //procurar
            params = {
                type: 'other'
            };
            $scope.showSearch = true;
        }
        else if (tab == 1) {
            params = {
                suggest: true,
                contacts: true
            };
            $scope.showSearch = false;
        }
        else if (tab == 2) {
            $scope.showSearch = true;
            params = {
                contacts: true
            };
        }

        $ionicScrollDelegate.scrollTop();


        params['limit'] = 20;
        params['page'] = 0;

        if (tab == 1) {
            params['limit'] = 100;
        }

        $scope.onClean(form);

        if (tab == 1) {
            params['limit'] = 100;
            scroll = false;
        }
    };


    var filterTextTimeout;

    $scope.searching = false;
    $scope.friendsResult = [];
    $scope.searchStart = false;

    $scope.onSearch = function(input, reset) {
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
            if (reset) {
                $scope.friendsResult = [];
            }
            params['word'] = "%" + input + "%";
            FRIEND.all(params).then(function(data) {
                $scope.searching = false;
                if (data.length == 0) {
                    scroll = false;
                }
                angular.forEach(data, function(v) {
                    $scope.friendsResult.push(v);
                });
                $ionicScrollDelegate.resize();

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }, 250); // delay 250 ms
    };

    $scope.onClean = function(form) {
        console.log('clean');
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.word = '';
            console.log('clean:form');
        }
        $scope.searching = false;
        $scope.friendsResult = [];
        $scope.searchStart = false;
        scroll = true;
        delete params['word'];
        load();
    };

    $scope.onAdd = function(item) {
        item.added = true;
        FRIEND.add(item);
    };

    $scope.onInvite = function(item) {
        item.invited = true;
        FRIEND.invite(item);
    };



    $scope.onChangeTab(null, 0);

    $scope.loadMore = function() {
        if (!scroll) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            return;
        }
        params['page'] = params['page'] + 1;
        var word = $scope.word;
        if (word.length >= 3) {
            $scope.onSearch($scope.word);
        }
        else {
            load();
        }

        console.log(params);
    }

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });


});
