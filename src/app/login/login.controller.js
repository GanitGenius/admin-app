'use strict';

angular.module('supportAdminApp')
  .controller('LoginController', [
              '$scope', '$rootScope', '$location', '$state', 'AuthService', 'TokenService', 'UserV3Service',
    function ($scope, $rootScope, $location, $state, $authService, $tokenService, $userV3Service) {

      $scope.loggingIn = false;

      $scope.isLoggingIn = function() {
        return $scope.loggingIn;
      };

      $scope.submit = function() {

        var loginSuccess = function() {
          var token = $tokenService.decodeToken();
          console.log(token);
          if($.inArray('administrator', token && token.roles) < 0) {
            $scope.$broadcast('AlertIssued', {type:'danger', message:'Permission denied.'});
            $scope.loggingIn = false;
            return;
          }
          $userV3Service.loadUser().then(function(currentUser) {
            console.log('Login Success');
            $rootScope.currentUser = currentUser;
            $state.go('index.main')
          });
        };

        var loginFailure = function() {
          console.log('Login Failed')
          $scope.loggingIn = false;
        };

        var options = {
          username:$scope.username,
          password:$scope.password,
          success: loginSuccess,
          error: loginFailure
        };

        $scope.loggingIn = true;
        $authService.login(options);
    };
  }]);
