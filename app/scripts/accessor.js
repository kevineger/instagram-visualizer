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
exports.getNewsFeedLikeNetwork = function(user_id, callback){
  instawrapper.authorize('521475077.20020af.0f0fd8dd50a44f0aa78e8eb295dd940d');
  instawrapper.getFollows(user_id).then(function(users){
    var userMediaQueries = users.map(function(user){
      return instawrapper.getRecentMedia(user.id)
      .then(function(newsFeedPosts){
          var posts = newsFeedPosts.data.map(function(post){
            return instawrapper.getLikesForMedia(post.id)
            .then(function(likes){
                return {post_id: post.id, likes: likes};
              })
            .catch(function(err){
              console.log(err);
            });
          });
          return Promise.all(posts);
        })
      .then(function(posts){
          console.log(posts);
          return posts;
        })
      .catch(function(err){
          console.log(err.stack);
        })
    });
    Promise.all(userMediaQueries, function(queries){
      callback(queries);
    });
  })
}
