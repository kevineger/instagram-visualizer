var cytoscape = require('cytoscape');
var t1 = require('./transformers/cytoviztransformer');
var t2 = require('./transformers/cytoviztransformer2');
var instwrapper = require('instawrapper');
var _ = require('underscore');
var afterDrawCallback;
var graph;
module.exports.vis = function(token, graphType) {
	console.log("Hit Nodes Dump");
	instwrapper.authorize(token);
	var transformer;

	if(graphType === 'Feed') {
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
			ready: afterDrawCallback,
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
					'curve-style': 'haystack',
					'width': 2,
					'line-color': '#ccc',
					'target-arrow-color': '#ccc'
				}
			}
			]
		});	
		
		graph.on('mousemove','node', function(event){
		});

	})
}

module.exports.getStats = function() {
	return {
		centrality: getBetweennessCentrality(),
		degree: getHighestDegree()
	};
}
module.exports.getGraph = function(){
	return graph;
}
function getBetweennessCentrality() {
	var bc = graph.$().bc();
	var bCentralities = [];
	graph.nodes().forEach(function(node) {
		bCentralities.push({
			node: node,
			betweeness: bc.betweenness('#' + node.data("id"))
		});
	});
	highestCentrality = _.max(bCentralities, function(c) {return c.betweeness});

	return {
		image: highestCentrality.node.data('image'),
		user: highestCentrality.node.data("name"),
		value: highestCentrality.betweeness
	}
}

function getHighestDegree() {
	var degrees = [];
	graph.nodes().forEach(function(node){
		degrees.push({
			node: node,
			degree: node.degree()
		});
	});

	highestDegree = _.max(degrees, function(c) {return c.degree});

	return {
		image: highestDegree.node.data('image'),
		user: highestDegree.node.data("name"),
		value: highestDegree.degree
	}
}
module.exports.onNodeHover = function(hoverCallback){
	graph.on('mousemove', 'node', hoverCallback);
};
module.exports.changeLayout = function(layout) {
	console.log(layout);
	graph.layout({name: layout});
	console.log(vis.getStats());
}
exports.afterDrawCallback = function(callback){
	afterDrawCallback = callback;
}
