const transformer = require('./scripts/transformers/feedNetworkTransformer');
const accessor = require('./scripts/accessor');
transformer.transform(function(data) {
  console.log(data);
});
