const instawrapper = require('instawrapper');
const _ = require('underscore');
/*
get users the user_id is following
loop through all users and get who they are following
if a user follows another user in the seen users, add an edge
 */

const handlePromiseError = function(err) {
  try {
    if (err.response.body.error_type) {
      console.log(err.response.body.error_type + ' for request ' + err.response.req.path);
      console.log(err.response.body.error_message);
    } else {
      console.log(err);
    }
  } catch (e) {
    console.log(err);
  }
};

// build the follow network
exports.getFollowNetwork = function(user_id, callback) {
  instawrapper.getFollows(user_id).then(function(data) {
    const users = {};
    const calls = [];
    // for every person the original user is following
    _.each(data, function(user) {
      // look the user up
      const call = instawrapper.getUser(user.id)
        .then(function(userObject) {
          if (userObject.data.counts.follows < 1000) {
            return instawrapper.getFollows(userObject.data.id);
          }
        })
        .then(function(follows) {
          users[user.id] = user;
          user.follows = [];
          _.each(follows, function(user2) {
            user.follows.push(user2.id);
          });
        })
        .catch(function handleError(err) {
          handlePromiseError(err);
        });
      calls.push(call);
    });
    return Promise.all(calls).then(function() {
      console.log('trying to call callback');
      callback(users);
    });
  })
    .catch(function(err) {
      handlePromiseError(err);
    });
};
exports.getNewsFeedLikeNetwork = function(user_id, callback) {
  instawrapper.getFollows(user_id).then(function(users) {
    const userMediaQueries = users.map(function(user) {
      return instawrapper.getRecentMedia(user.id, {count: 3})
      .then(function(newsFeedPosts) {
        const posts = newsFeedPosts.data.reduce(function(previous, post) {
          if (post.likes.count > 1000) {
            console.log(post.id + 'has too many likes, not including in graph');
          } else {
            const likeCall = instawrapper.getLikesForMedia(post.id)
            .then(function(likes) {
              return {post_id: post.id, likes: likes};
            })
            .catch(function(err) {
              handlePromiseError(err);
            });
            previous.push(likeCall);
          }
          return previous;
        }, []);
        return Promise.all(posts);
      })
      .then(function(posts) {
        return posts;
      })
      .catch(function(err) {
        handlePromiseError(err);
      });
    });
    Promise.all(userMediaQueries).then(function(queries) {
      const flattenedQueries = queries.reduce((previous, current) => {
        if (typeof current !== 'undefined') {
          _.each(current, (item) => { previous.push(item);});
        }
        return previous;
      }, []);
      callback(flattenedQueries);
    });
  })
  .catch(function(err) {
    handlePromiseError(err);
  });
};
