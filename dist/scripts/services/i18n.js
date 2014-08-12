'use strict';

/**
 * @ngdoc overview
 * @name i18nServiceProvider
 * @description
 * # i18nService
 *
 * i18n module.
 */

angular.module('i18nServiceProvider', [])

.service('i18nService', function ($cookies,$cookieStore,$http,$interpolate){

  /**
   * @description
   * Internationalization (i18n & l10n) controller
   * 
   * 
   * Functions and variables:
   * files - array of file names from i18n land folders
   * l10n - current language object
   * i18n - internationalization object, contains:
   *   setLocale() - method to load locales
   *   traverseI18nFiles() - look up for language files
   *   init() - get i18n config file
   *   get() - method to get and parse values
   *
   * userLocale code in format xx-XX of navigator language
   * currentLocale code in format xx of current locale
   * defaultLocale code in format xx of default locale for your application
   * Creates Cookie: 'locale' - store current locale code
   * 
   * 
   * 
   */

  var t = this;
  t.files = [];
  t.l10n = {};
  t.i18n = {};
  t.i18n.defaultLocale = 'en';
  t.i18n.currentLocale = 'en';

  /*
   * Detect user's browser locale
   */

  t.i18n.userLocale = window.navigator.userLanguage || window.navigator.language || navigator.userLanguage;


  /**
   * @description
   * Set locale (by ISO code)
   * Load up all locale files into i18n variable
   * in according to public/i18n folder
   * 
   * @param:
   * locale en|ru|ch|etc.
   */
  t.i18n.setLocale = function (locale){

    t.i18n.currentLocale = $cookies.locale = locale;

    if(!t.i18n[locale]){

      t.i18n.traverseI18nFiles(locale);

    }else{

      angular.forEach(t.files, function (file){
        t.l10n[file] = t.i18n[locale][file];
      });
    }
  };


  /**
   * @description
   * Walk throurhgt i18n files
   * and store 'em into variable
   * 
   * @param:
   * locale en|ru|ch|etc.
   * 
   */
  t.i18n.traverseI18nFiles = function (locale){

    angular.forEach(t.files, function (file){
      
      t.i18n[locale] = {};

      $http.get('i18n/' + locale + '/' + file + '.json').success(function(data){ 
        t.l10n[file] = t.i18n[locale][file] = data; 
      });
    });
  };


  /**
   * @desription
   * Initialize i18n
   * Fetch config file
   */
  t.i18n.init = function (scope,files,defaultLocale){

    if(defaultLocale){
      t.i18n.defaultLocale = defaultLocale;
    }

    t.files = files;

    angular.forEach(t.files, function (file){

      t.l10n[file] = {};
    });

    var userLocale = t.i18n.userLocale.split('-')[0];
    t.i18n.config = {};
    
    $http .get('i18n/i18n.json').success(function (response){ 

      t.i18n.config = response; 
      t.i18n.setLocale(($cookies.locale) ? $cookies.locale : (t.i18n.config[userLocale]) ? userLocale : t.i18n.defaultLocale);
    });

    if(scope){
      
      scope.l10n = t.l10n;
      scope.i18n = t.i18n;
      return scope;
    
    }else{

      return t.l10n;
    }
    
  };

  /*
   * @description
   * Shortcut for i18n.init()
   */
  t.init = function (scope,files,defaultLocale){
    return t.i18n.init(scope,files,defaultLocale);
  };

  /**
   * @desription
   * Get values, and do pattern replaces
   * from files in in public/i18n folder
   *
   * @params:
   * param string in form of file.key.key.key... etc.
   * replacements array or object of replacements
   */
  t.i18n.get = function (param, replacements){

    if(param){

      var params = param.split('.');
      var value  = t.l10n[params[0]];

      if(value && Object.getOwnPropertyNames(value).length > 0){

        var matches, i;

        for (i = 1; i < params.length; i++) {
          value = value[params[i]];
        }

        matches = value.match(/\{{(.*?)\}}/g);

        if(matches && replacements){

          for (i = matches.length - 1; i >= 0; i--) {
            value = value.replace(matches[i], (Object.prototype.toString.call(replacements) === '[object Object]') ? replacements[matches[i].replace('{{', '').replace('}}', '').trim()] : replacements[i]);
          }
        }

        matches = value.match(/\{{(.*?)\}}/g);

        if(matches && value){

          value = $interpolate(value)(this);
        }

        return value;
      }
    }

    return param;
  };

  return this;
});