angular.module('livrio.controllers')

.controller('book_loan_ctrl', function($scope, $rootScope, $filter, LOAN) {


    var trans = $filter('translate');

    $scope.empty_list = trans('book_loan.empty_list');

    $scope.activeTab = true;


    $scope.loading = true;
    $scope.onRefresh = function() {

        params = {}
        if ($scope.activeTab) {
            params['loan_friend'] = true
        }
        else {
            params['loan_owner'] = true
        }
        LOAN.all(params)
        .then(function(data) {
            $scope.loans = data;
            $scope.loading = false;
        });
    };

    $scope.onRefresh();

    $rootScope.$on("book_loan.refresh",function() {
        $scope.onRefresh();
    });


    $scope.onChangeTab = function(tab) {
        $scope.activeTab = tab;
        $scope.onRefresh();
    }
});
