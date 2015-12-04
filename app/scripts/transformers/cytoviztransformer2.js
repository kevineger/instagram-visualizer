var accessor = require('./../accessor');
var _ = require('underscore');
const instagram = require('instawrapper');

function getNode (userWithFollower) {
  return { data : {
    name: userWithFollower.username,
    id: userWithFollower.id,
    shape: 'circularImage',
    // image: __dirname + '/../../assets/img/yong.jpg',
    image: userWithFollower.profile_picture,
    class: 'yongface',
  },
  id: userWithFollower.id,
};
}

exports.transform = function(callback) {
  accessor.getNewsFeedLikeNetwork(function(posts) {
    const edges = [];
    const nodes = [];

    // put all the base nodes into nodes
    _.each(posts, function(post) {
      _.each(post.likes, function(user) {
        if (_.findWhere(nodes, {id: user.id})) {
          // do nothing because its a duplicate
        } else {
          const node = getNode(user);
          nodes.push(node);
        }
      });
    });

    _.each(posts, function(post) {
      _.each(post.likes, function(user2) {
        const node1 = _.findWhere(nodes, {id: post.post_id.split('_')[1]});
        const node2 = _.findWhere(nodes, {id: user2.id});
        // halp
        if (node1 && node2 && node1.id !== node2.id) {
          edges.push({ data : {
            source: node1.id,
            target: node2.id,
          }});
        }
      });
    });
    callback({nodes: nodes, edges: edges});
  });
};
