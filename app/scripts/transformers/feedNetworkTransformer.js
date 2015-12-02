const accessor = require('./../accessor');
const _ = require('underscore');

function getNode(userWithFollower) {
  return {
      name: userWithFollower.username,
      id: userWithFollower.id,
      shape: 'circularImage',
      image: __dirname + '/../../assets/img/yong.jpg'
  };
}

exports.transform = function(callback) {
  accessor.getNewsFeedLikeNetwork(521475077, function(posts) {
    const edges = [];
    const nodes = [];

    // put all the base nodes into nodes
    _.each(posts, function(post) {
      _.each(post.likes, function(user) {
        const node = getNode(user);
        nodes.push(node);
      });
    });

    // loop through all the followers and check if they exist, if the id is found in our nodes array, create an edge
    _.each(posts, function(post) {
      _.each(post.likes, function(user) {
        // if followed is found in nodes, we create an edge between user.id and the followed node we found
        const nodeOne = _.findWhere(nodes, {id: user.id});
        if (nodeOne) {
          edges.push({
              source: _.indexOf(nodes, _.findWhere(nodes, {id: user.id})),
              target: _.indexOf(nodes, nodeOne),
              from: user.id,
              to: nodeOne.id});
        }
      });
    });
    callback({nodes: nodes, edges: edges});
  });
};
