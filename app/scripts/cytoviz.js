var cytoscape = require('cytoscape');
var t1 = require('./transformers/cytoviztransformer');
var t2 = require('./transformers/cytoviztransformer2');
var instwrapper = require('instawrapper');
var _ = require('underscore');

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
					'curve-style': 'haystack',
					'width': 2,
					'line-color': '#ccc',
					'target-arrow-color': '#ccc'
				}
			}
			]
		});	
	})
}

module.exports.getStats = function() {

	return {
		centrality: getBetweennessCentrality(),
		degree: getHighestDegree()
	};
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
		user: highestDegree.node.data("name"),
		value: highestDegree.degree
	}
}

module.exports.changeLayout = function(layout) {
	graph.layout({name: layout});
	console.log(vis.getStats());
}
