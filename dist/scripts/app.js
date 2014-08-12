'use strict';

/**
 * @ngdoc overview
 * @name myMulitilingualApp
 * @description
 * # myMulitilingualApp
 *
 * Main module of the application.
 */

angular.module('myMulitilingualApp', 
  [
    'ngCookies',
    'ngResource',
    'i18nServiceProvider' /* HERE IS OUR i18n SERVICE PROVIDER IS ENJECTED*/
  ])

.controller('mainController', function (i18nService, $scope){

  /* example object to work with */
  $scope.user = {
    name: 'Arnold',
    city: 'Berlin',
    country: 'Deuchland',
    company: {
      name: 'Soft&Core',
      profession: 'Core Software Developer'
    }
  };

  i18nService.init($scope, ['index'], 'en');
});