var cytoscape = require('cytoscape');
var t1 = require('./transformers/cytoviztransformer');
var t2 = require('./transformers/cytoviztransformer2');
var instwrapper = require('instawrapper');
var graph;
module.exports.vis = function(token, graph) {
	console.log("Hit Nodes Dump");
	instwrapper.authorize(token);
	var transformer;

	if(graph === 'Feed') {
		transformer = t2;
	}else{
		transformer = t1;
	}

	transformer.transform(function(data) {
		var options = {
			name: 'cose'
		};
		graph = cytoscape({
			container: document.getElementById('graph'),

			// Ready callback function
			// ready: function(evt){ /* ... */ },

			elements: {
				nodes: data.nodes,
				edges: data.edges,
			},
			layout: options,
			style: [ // the stylesheet for the graph
			{
				selector: 'node',
				style: {
					// 'background-image':'http://cosc.ok.ubc.ca/__shared/assets/gao9404.jpg',
					'background-image':'data(image)',
					'background-fit':'cover',
					'label': 'data(name)'
				}
			},

			{
				selector: 'edge',
				style: {
					'width': 2,
					'line-color': '#ccc',
					'target-arrow-color': '#ccc'
				}
			}
			]
		});	

	})
}
module.exports.changeLayout = function(layout) {
	graph.layout({name: layout});
}
