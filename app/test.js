var transform = require('./scripts/transformers/d3Transformer');
var accessor = require('./scripts/accessor');
var fs = require('fs');
var _ = require('underscore');
accessor.getFollowNetwork(521475077,function(data) {
  console.log('users', _.size(data));
});
