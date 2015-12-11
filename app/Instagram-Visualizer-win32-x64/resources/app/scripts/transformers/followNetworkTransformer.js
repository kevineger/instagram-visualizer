var accessor = require('./../accessor');
var _ = require('underscore');
const instagram = require('instawrapper');
console.log('authorizing');
instagram.authorize('206496671.20020af.c815ff28a2924433bcafd70e1bf3405c');

function getNode(userWithFollower){
  return {
      name: userWithFollower.username,
      id: userWithFollower.id,
      shape: 'circularImage',
      image: __dirname + '/../../assets/img/yong.jpg'
  };
}

exports.transform = function(callback) {
  console.log("test: getting network");
  accessor.getFollowNetwork(521475077, function(usersWithFollowers) {
    console.log("test: network got");
    var edges = [];
    var nodes = [];
  
    // put all the base nodes into nodes
    _.each(usersWithFollowers, function(user){
      var node = getNode(user);
      nodes.push(node);
    });
  
    //loop through all the followers and check if they exist, if the id is found in our nodes array, create an edge
    _.each(usersWithFollowers, function(user){
      _.each(user.follows, function(followed){
        //if followed is found in nodes, we create an edge between user.id and the followed node we found
        var followNode = _.findWhere(nodes, {id: followed});
        if(followNode){
          edges.push({
              source: _.indexOf(nodes, _.findWhere(nodes, {id: user.id})),
              target: _.indexOf(nodes, followNode),
              from: user.id,
              to: followNode.id})
        }
      });
    });
    callback({nodes: nodes, edges: edges});
  });
};
