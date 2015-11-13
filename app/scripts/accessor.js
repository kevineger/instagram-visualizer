var instawrapper = require('instawrapper');
var _ = require('underscore');
/*
get users the user_id is following
loop through all users and get who they are following
if a user follows another user in the seen users, add an edge
 */
exports.getFollowNetwork = function(user_id, callback){

  //get the original users follows
  instawrapper.getFollows(user_id).then(function(response){
    var users = {};
    var api_calls = [];
    // for every person the original user is following
    _.each(response.data, function(user){
      // get all the followers for the user

      var call = instawrapper.getFollows(user.id)
      .then(function(response2){
          users[user.id] = user;

          user.followers = [];
          _.each(response2.data, function(user2){
            user.followers.push(user2.id);
          });
      });

      api_calls.push(call);
    });
    Promise.all(api_calls).then(function() {
      callback(users);
    });
  })
    .catch(function(err){
      console.log(err);
      console.log('first callback');
    });
};