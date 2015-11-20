var instawrapper = require('instawrapper');
var _ = require('underscore');
/*
get users the user_id is following
loop through all users and get who they are following
if a user follows another user in the seen users, add an edge
 */
exports.getFollowNetwork = function(user_id, callback){
  instawrapper.authorize('521475077.20020af.0f0fd8dd50a44f0aa78e8eb295dd940d');
  instawrapper.getFollows(user_id).then(function(data){
    var users = {};
    var calls = [];
    // for every person the original user is following
    _.each(data, function(user){
      // look the user up
      var call = instawrapper.getUser(user.id)
        .then(function(userObject){
          if(userObject.data.counts.follows < 1000){
            return instawrapper.getFollows(userObject.data.id);
          }else{
            console.log('Excluding '+userObject.data.username+' because they have too many follows')
          }
        })
        .then(function(follows) {
          users[user.id] = user;
          user.follows = [];
          _.each(follows, function (user2) {
            user.follows.push(user2.id);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
      calls.push(call);
    })
    return Promise.all(calls).then(function() {
      callback(users);
    });
  })
    .catch(function(err){
      console.log(err);
      console.log('first callback');
    });
};
