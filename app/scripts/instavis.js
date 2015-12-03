var vis = require('vis');
var transformer = require('./transformers/followNetworkTransformer');

var imgPath= __dirname + '/../assets/img/yong.jpg';

module.exports.vis = function(token){
    console.log("test: instavis running");

    transformer.transform(function(dataForGraph){
        console.log("test: inner");
        // create an array with nodes
        var nodes = new vis.DataSet(dataForGraph.nodes);
        console.log("test: nodesSet");

        // create an array with edges
        var edges = new vis.DataSet(dataForGraph.edges);
        console.log("test: edges set");


        // create a network
        var container = document.getElementById('graph');
        console.log("test: container got");

        var data = {
          nodes: nodes,
          edges: edges
        };
        var options = {};

        console.log("vis: Drawing this bitch");
        var network = new vis.Network(container, data, options);
        console.log("vis: container got");

    })};
