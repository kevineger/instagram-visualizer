var vis = require('vis');
var transformer = require('./transformers/d3Transformer');

var imgPath= __dirname + '/../assets/img/yong.jpg'

transformer.transform(function(data) {

    // create an array with nodes
    var nodes = new vis.DataSet(data.nodes);

    // create an array with edges
    var edges = new vis.DataSet(data.edges);

    // create a network
    var container = document.getElementById('graph');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);

})
