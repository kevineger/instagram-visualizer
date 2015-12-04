var cytoscape = require('cytoscape');
var transformer = require('./transformers/cytoviztransformer');
var instwrapper = require('instawrapper');
var graph;
module.exports.vis = function(token) {
	console.log("Hit Nodes Dump");
	instwrapper.authorize(token);
	transformer.transform(function(data) {
		var options = {
			name: 'cose'
		};
		graph = cytoscape({
			container: document.getElementById('graph'),
		
			elements: {
				nodes: data.nodes,
				edges: data.edges,
			},
			layout: options,
			style: cytoscape.stylesheet().selector('node').css({'background-image':'http://cosc.ok.ubc.ca/__shared/assets/gao9404.jpg','background-fit':'cover'})
		});
	})
}
module.exports.changeLayout = function(layout) {
	graph.layout({name: layout});
}
