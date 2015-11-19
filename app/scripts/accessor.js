var instawrapper = require('instawrapper');
var _ = require('underscore');
/*
get users the user_id is following
loop through all users and get who they are following
if a user follows another user in the seen users, add an edge
 */
exports.getFollowNetwork = function(user_id, callback){

  instawrapper.authorize('206496671.20020af.c815ff28a2924433bcafd70e1bf3405c');

  instawrapper.getFollows(user_id).then(function(data){
    var users = {};
    var inner_calls = [];
    var outer_calls = [];
    // for every person the original user is following
    _.each(data, function(user){
      // look the user up
      var outerCall = instawrapper.getUser(user.id)
        .then(function(userObject){
          return userObject;
        })
        //
        .then(function(userObject){
          
            var call = instawrapper.getFollows(user.id)
              .then(function(response2){
                users[user.id] = user;
                user.follows = [];
                _.each(response2, function(user2){
                  user.follows.push(user2.id);
                });
              })
              .catch(function(err){
                console.log(err.body);
              });
            inner_calls.push(call);
        }).catch(function(err){console.log('error', err)});
      inner_calls.push(outerCall)
    });
    Promise.all(outer_calls).then(function() {
      Promise.all(inner_calls).then(function() {
        callback(users);
      });
    });
  })
    .catch(function(err){
      console.log(err);
      console.log('first callback');
    });
};
