angular.module('app')
    .config(['$interpolateProvider', '$httpProvider', function($interpolateProvider, $httpProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }])
