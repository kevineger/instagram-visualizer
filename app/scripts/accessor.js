var instawrapper = require('instawrapper');
var _ = require('underscore');
/*
get users the user_id is following
loop through all users and get who they are following
if a user follows another user in the seen users, add an edge
 */
exports.getFollowNetwork = function(user_id, callback){
  var api_calls = [];
  //get the original users follows
  instawrapper.getFollows(user_id).then(function(response){
    // for every person the original user is following
    _.each(response.data, function(user){
      // get all the followers for the user
      api_calls.push(instawrapper.getFollows(user.id))
    });
    Promise.all(api_calls).then(function(output) {
      var users = {};
      _.each(output, function(output1){
        users[output1.id] = output1;
      });
      console.log(users)
    });
  })
    .catch(function(err){
      console.log(err);
      console.log('first callback');
    });
};