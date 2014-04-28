/**
 * Created by saber on 4/6/14.
 */
'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'CornerCouch',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'
]).
    config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
        $routeProvider.when('/', {templateUrl: 'template/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when('/computers/new', {templateUrl: 'template/partial2.html', controller: 'MyCtrl2'});
        $routeProvider.when('/computers/:id', {templateUrl: 'template/partial3.html', controller: 'MyCtrl3'});
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(false);//.hashPrefix('!');
    }]);