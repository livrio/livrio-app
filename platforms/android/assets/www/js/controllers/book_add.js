
angular.module("starter.controllers")

.controller("bookAddCtrl", function($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $filter, $ionicScrollDelegate, BOOK) {

    var trans = $filter('translate');

    $scope.books = [];

    $scope.readingISBN = false;

    $ionicModal.fromTemplateUrl('templates/book-add-list.html', {
        scope: $scope
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
                    $ionicPopup.alert({
                        template: trans('book_form.isbn_not_found')
                    });
                }
            });
        },
        function(o) {
            if (o.code == -1) {
                $ionicPopup.alert({
                    template: String.format(trans('book_form.barcode_invalid'), o.text)
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

    $scope.empty_list = trans('book_form.empty_list');
    $scope.empty_search = trans('book_form.empty_search');

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
        });
    }
});