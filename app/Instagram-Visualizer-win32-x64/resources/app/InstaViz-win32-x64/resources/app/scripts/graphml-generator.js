var builder = require('xmlbuilder');
var transformer = require('./transformers/cytoviztransformer');
var fs = require('fs');

var xmlString;

// <key id="label" for="all" attr.name="label" attr.type="string"/>\
// <key id="weight" for="node" attr.name="weight" attr.type="double"/>\

var root = builder.create('graphml')
.ele('key', {'id': 'label', 'for': 'node', 'attr.name': 'label', 'attr.type': 'string'})
.up()
.ele('key', {'id': 'weight', 'for': 'node', 'attr.name': 'weight', 'attr.type': 'double'})
.up()
.ele('graph', {'edgedefault': 'directed'});

// module.exports.genGraphMl = function() {
	transformer.transform(function(data) {
	
		// Array of nodes
		var nodes = data.nodes;
	
		// Array of edges
		var edges = data.edges;
	
		// Add all nodes
		nodes.forEach(addNodeToGraphml);
		// Add all edges
		edges.forEach(addEdgeToGraphml);
	
		xmlString = root.end({ pretty: true, indent: '  ', newline: '\n' });
	
		// Write Graphml file to user's downloads folder
		var downloadsDir = getUserHome() + "/Downloads/"
		fs.writeFile(downloadsDir + 'instagram.graphml', xmlString, function(err) {
			if(err) {
				return console.log(err);
			}
	
			console.log("Graphml file saved as instagram.graphml to " + downloadsDir);
		}); 
	
	})
// }

function addNodeToGraphml(node)
{
	console.log("Adding node to graphml" + node.data.id)
	// Add node with id=InstagramID and name=username
	root.ele('node', {'id': node.data.id})
	.ele('data', {'key': 'label'}, node.data.name)			
	.insertAfter('data', {'key': 'weight'}, '1.0')
	// Reset pointer to graph root node
	.up().up();
}

function addEdgeToGraphml(edge)
{
	console.log("Adding edge to graphml" + edge.data.target + " -> " + edge.data.source);
	// Add edge with corresponding soure and target ids
	root.ele('edge', {'source': edge.data.source, 'target': edge.data.target})
	.ele('data', {'key': 'label'}, edge.data.target + ' to ' + edge.data.source)
	// Reset pointer to graph root node
	.up().up();
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}