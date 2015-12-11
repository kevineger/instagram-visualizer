const transformer = require('./scripts/transformers/cytoviztransformer2.js');
const accessor = require('./scripts/accessor');
transformer.transform(function(data) {
  console.log(data);
});
