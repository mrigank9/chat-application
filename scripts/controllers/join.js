'use strict';


  angular.module('pnChatApp').controller('JoinCtrl', ['$scope','$rootScope','$location','PubNub',
   function ($scope,$rootScope,$location,PubNub) {
    
    $scope.data = {
    	username: 'User_' +Math.floor(Math.random()*1000)
    };

    $scope.join = function(){
    	console.log('Joining..please wait');

    var _ref,_ref1;
    $rootScope.data = {};
    $rootScope.data.username= (_ref = $scope.data) !== null ? _ref.username : void 0;
    $rootScope.data.city= (_ref1 = $scope.data) !== null ? _ref1.city : void 0;
   // $rootScope.data.uuid= Math.floor(Math.random()*1000000)+'	'+$scope.data.username;

    console.log($rootScope);

    PubNub.init({
    	subscribe_key: 'sub-c-86eb8fb6-545f-11e7-a683-0619f8945a4f',
    	publish_key: 'pub-c-40ad6509-d71b-4080-986f-3f5eaa3a1986',
    	uuid: $rootScope.data.uuid,
    });
  return $location.path('/main');
};
  
  }]);
