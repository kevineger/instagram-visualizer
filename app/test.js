var transform = require('./scripts/transformers/d3Transformer');
var accessor = require('./scripts/accessor');

console.log('test');
accessor.getFollowNetwork(521475077,function(data){
  console.log(data);
});
