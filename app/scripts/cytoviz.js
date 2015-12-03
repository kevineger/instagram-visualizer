var cytoscape = require('cytoscape');
var transformer = require('./transformers/cytoviztransformer');
var instwrapper = require('instawrapper');

module.exports.vis = function(token){
	console.log("Hit Nodes Dump");
	instwrapper.authorize(token);
	transformer.transform(function(data) {
		var options = {
			name: 'cose',				
			padding: 12,
			animate: true,
			gravity: 80,
			animateThreshold: 250
		};
		var cy = cytoscape({
			container: document.getElementById('graph'),
		
			elements: {
				nodes: data.nodes,
				edges: data.edges,
			},
			style: cytoscape.stylesheet().selector('node').css({'background-image':'http://cosc.ok.ubc.ca/__shared/assets/gao9404.jpg','background-fit':'cover'})
		});	
		cy.layout(options);
	})
}