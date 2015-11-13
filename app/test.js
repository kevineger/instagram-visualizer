var transform = require('./scripts/transformers/d3Transformer');


transform.transform(function(data){
   console.log(data.edges.length/2);
   console.log(data.nodes.length);
});
