'use strict';

  angular.module('pnChatApp').controller('MainCtrl', ['$scope','$rootScope','$location','PubNub', function ($scope,$rootScope,$location,PubNub) {
      
      var _ref;
       if(!PubNub.initialized()){
           $location.path('/join');
      }
      
      $scope.controlChannel = '__controlchannel';
      
      $scope.channels = [];
      //create channel
      
      $scope.publish=function(){
          if(!$scope.selectedChannel){
              return;
          }
          PubNub.ngPublish({
              channel: $scope.selectedChannel,
              message: {
                  text: $scope.newMessage,
                  user: $scope.data.username
              } 
          });
          $scope.newMessage='';
          return $scope.newMessage;
      };
      $scope.createChannel = function()
      {
          var channel;
          console.log('creating channel--');
          channel = $scope.newChannel;
          
          $scope.newChannel = '';
         PubNub.ngGrant({
              channel: channel,
              read: true, 
              write: true,
              callback: function(){
                  return console.log(channel+'All set', arguments);
              }
          });
          PubNub.ngGrant({
              channel: channel + '-pnpres',
              read: true,
              write: false,
              callback: function(){
                  return console.log(channel+'Presence all set', arguments);
              }
          });

          
          PubNub.ngPublish({
            channel: $scope.controlChannel,
            message: channel
          });
          
          return setTimeout(function(){
             $scope.subscribe(channel);
              $scope.showCreate = false;
              return $scope.showCreate;
          }, 100);
          };   
      
      $scope.subscribe = function(channel)
      {
          var _ref;
          console.log('subscribing--');
          if(channel === $scope.selectedChannel){
              return;
          }
          if($scope.selectedChannel)
             {
                PubNub.ngUnsubscribe({
                    channel: $scope.selectedChannel
                });
             }
          $scope.selectedChannel = channel;
          $scope.messages = ['welcome to'+channel];
          PubNub.ngSubscribe({
                channel: $scope.selectedChannel,
                    state:
                    {
                        "city": ((_ref = $rootScope.data) !== null ? _ref.city : void 0) || 'unknown'
                    },
                    error: function()
                    {
                         return console.log(arguments);
                    }       
                 });
                 //check for events if present in channel
                 $rootScope.$on(PubNub.ngPrsEv($scope.selectedChannel),
                                function(ngEvent,payload){ 
                     return $scope.$apply(function(){
                         var newData, userData;
                         userData=PubNub.ngPresenceData($scope.selectedChannel);
                         newData={};
                         $scope.users = PubNub.map(PubNub.ngListPresence($scope.selectedChannel),
                                                   function(x) {
                             var newX;
                             newX = x;
                             if(x.replace) {
                                 newX = x.replace(/\w+__/,"");
                             }
                             if(x.uuid) {
                                 newX = x.uuid.replace(/\w+__/,"");
                             }
                             newData[newX] = userData[x] || {};
                             return newX;
                         });
                         $scope.userData = newData;
                         return $scope.userData;
                      });             
                    });
          //retreiving current users
          PubNub.ngHereNow({ channel: $scope.selectedChannel });
          
          $rootScope.$on(PubNub.ngMsgEv($scope.selectedChannel), function(ngEvent, payload) 
                        {
              var msg;
              msg=payload.message.user ? "[" + payload.message.user + "]"+payload.message.text:null;
              return $scope.$apply(function()  {
              return $scope.messages.unshift(msg);
          });
          });
              return PubNub.ngHistory({
              channel: $scope.selectedChannel,
              auth_key: $scope.authKey,
              count: 500
          });    
      };
      
      PubNub.ngSubscribe({
          channel: $scope.controlChannel
      });
      
      $rootScope.$on(PubNub.ngMsgEv($scope.controlChannel), function(ngEvent,payload) {
          return $scope.$apply(function() {
              if($scope.channels.indexOf(payload.message) < 0) {
                  return $scope.channels.push(payload.message);
              }
          });
        });
      
      PubNub.ngHistory({
              channel: $scope.controlChannel,
              count: 500
          });   
      
      $scope.newChannel = 'The waiting room';
      return $scope.createChannel();
      
  }]);
