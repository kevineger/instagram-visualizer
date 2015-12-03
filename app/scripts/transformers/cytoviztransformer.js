var accessor = require('./../accessor');
var _ = require('underscore');
const instagram = require('instawrapper');

function getNode(userWithFollower){
  return { data : {
    name: userWithFollower.username,
    id: userWithFollower.id,
    shape: 'circularImage',
    image: __dirname + '/../../assets/img/yong.jpg',
    class: 'yongface',
  },
  id: userWithFollower.id,
};
}

exports.transform = function(callback){
  accessor.getFollowNetwork(function(usersWithFollowers){
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

        // console.log(followNode);

        if(followNode){
          edges.push({ data : {
            source: user.id,
            target: followNode.id,
          }
        });
        }
        // source: user.username,
        // target: followNode.username,
      });
    });
    callback({nodes: nodes, edges: edges});
  })
}