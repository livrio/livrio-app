
angular.module("starter.controllers")

.controller("bookAddCtrl", function($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $filter, $ionicScrollDelegate, BOOK) {

    var trans = $filter('translate');

    $scope.books = [];

    $scope.readingISBN = false;

    $ionicModal.fromTemplateUrl('templates/book-barcode.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalPermission = modal;
    });


    $scope.onClose = function() {
        $scope.modalPermission.hide();
        window.location = '#/app/library';
    };

    $scope.onForm = function() {
        $scope.modalPermission.hide();
        window.location = '#/app/book-form';
    };


    $rootScope.$on("book.add",function(e, book) {
        console.log(arguments);
        $scope.books.push(book);
        $scope.modalPermission.show();
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
        window.location = '#/app/book-add';
    });

    function hideModalIsEmpty() {
        if ($scope.books.length == 0 ) {
            $scope.modalPermission.hide();
        }
    }

    $scope.onScan = function() {

        BOOK.scanISBN()
        .then(function(v) {
            console.log(v);
            $scope.readingISBN = true;
            $scope.modalPermission.show();
            BOOK.getByISBN(v)
            .then(function(book) {
                if (book.is_book) {
                    $ionicPopup.alert({
                        template: String.format(trans('book_form.isbn_duplicate'), book.title)
                    });
                    $scope.readingISBN = false;
                    hideModalIsEmpty();
                }
                else {
                    BOOK.save({
                        isbn: book.isbn
                    })
                    .then(function() {
                        $scope.books.push(book);
                        $scope.readingISBN = false;
                        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                    });
                }
            },
            function(o) {
                $scope.readingISBN = false;
                hideModalIsEmpty();
                if (o.code == -1) {
                    $ionicPopup.confirm({
                        template: 'Não conseguimos localizar os dados do livros com esse ISBN!<br />Quer cadastra-lo manualmente?'
                    })
                    .thne(function(res) {
                        if (res) {
                            window.location = '#/app/book-form';
                        }
                    });
                }
            });
        },
        function(o) {
            console.log('ISBN invalid!');

            if (o.code == -1) {
                $ionicPopup.alert({
                    title: 'Código invalido',
                    okText: 'OK',
                    template: 'O código de barras <strong>' + o.text + '</strong> é invalido.'
                });
            }
        });
    }


    var filterTextTimeout;

    $scope.searching = false;
    $scope.librarys = [];
    $scope.searchStart = false;

    $scope.search = {};


    var trans = $filter('translate');

    $scope.empty_list = trans('search.empty_list');
    $scope.empty_search = trans('search.empty_search');

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
            $scope.librarys = [];
            BOOK.search({
                word: input
            }).then(function(data) {
                $scope.searching = false;
                $scope.librarys = data;
                $ionicScrollDelegate.resize();
            });
        }, 500); // delay 500 ms
    };

    $scope.onClean = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
            $scope.search = {};
        }
        $scope.searching = false;
        $scope.librarys = [];
        $scope.searchStart = false;
    };


    $scope.onAdd = function(item) {
        BOOK.save({
            ref: item.id
        })
        .then(function() {
            item.added = true;
        },
        function() {
            console.log('ERROR');
        });
    }
});