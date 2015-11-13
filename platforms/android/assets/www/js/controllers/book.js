angular.module("livrio.controllers")

.controller("book_ctrl", function($scope, $rootScope, $filter, $ionicModal, BOOK, SHELF) {

    var trans = $filter('translate');

    $scope.librarys = [];

    $scope.loading = true;

    $scope.empty_list = trans('book.empty_list');

    $scope.onRefresh = function() {
        BOOK.all().then(function(books) {
            $scope.librarys = books;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loading = false;
        });
    };

    $scope.onRefresh();

    $rootScope.$on("book.refresh",function() {
        $scope.onRefresh();
    });


    
    $ionicModal.fromTemplateUrl('templates/modal/shelfs.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.onClose = function() {
        $scope.modal.hide();
    };

    var book_shelf;
    $scope.onSaveShelf = function() {
        var ids = [];
        angular.forEach($scope.shelfList, function(v) {
            if (v.checked) {
                ids.push(v.id);
            }
        });

        console.log(book_shelf);

        BOOK.save({
            id: book_shelf.id,
            shelfs: ids
        })
        .then(function(book) {
            book_shelf = book;
            SHELF.all();
        });
        $scope.modal.hide();
    };


    $rootScope.$on("book.shelf",function(e, book) {
        book_shelf = book;
        $scope.book_title = book.title;

        $scope.shelfList = $rootScope.shelfs;

        angular.forEach($scope.shelfList, function(v) {
            v.checked = false;
            angular.forEach(book.shelfs, function(v1) {
                if (v1.id == v.id) {
                    v.checked = true;
                }
            });
        });

        $scope.modal.show();
    });

});
