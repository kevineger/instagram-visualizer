var cytoscape = require('cytoscape');
var transformer = require('./transformers/cytoviztransformer');

module.exports.vis = function(token){
	console.log("Hit Nodes Dump");
	transformer.transform(function(data) {
		var cy = cytoscape({
			container: document.getElementById('graph'),

			elements: {
				nodes: data.nodes,
				edges: data.edges,
			},
			layout: {
				name: 'circle',
			},
			style: cytoscape.stylesheet().selector('node').css({'background-image':'http://cosc.ok.ubc.ca/__shared/assets/gao9404.jpg','background-fit':'cover'})
		});	
		console.log("Jake has a vagina");
		console.log(JSON.stringify(data.nodes, null, 4));
	})
}