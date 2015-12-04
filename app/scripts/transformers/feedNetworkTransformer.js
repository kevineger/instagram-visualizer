const accessor = require('./../accessor');
const _ = require('underscore');
const instagram = require('instawrapper');
console.log('authorizing');
instagram.authorize('47419315.20020af.a2624fa7e8b448dca16fbd3e350c68e5');

function getNode(userWithFollower) {
  return {
      name: userWithFollower.username,
      id: userWithFollower.id,
      shape: 'circularImage',
      image: __dirname + '/../../assets/img/yong.jpg'
  };
}

exports.transform = function(callback) {
  console.log('I got called');
  accessor.getNewsFeedLikeNetwork(function(posts) {
    console.log('Im not useless');
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
          edges.push({
            source: _.indexOf(nodes, node1),
            target: _.indexOf(nodes, node2),
            from: node1.id,
            to: node2.id
          });
        }
      });
    });

    callback({nodes: nodes, edges: edges});
  });
};
