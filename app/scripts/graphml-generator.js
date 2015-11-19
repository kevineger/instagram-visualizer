var builder = require('xmlbuilder');

var xml = builder.create('graphml')
	.ele('graph', {'edgedefault': 'directed'})
		// Node 1
		.ele('node', {'id': '1'})
			.ele('data', {'key': 'label'}, 'A')
			.insertAfter('data', {'key': 'weight'}, '1.0')
		.up().up()
		// Node 2
		.ele('node', {'id': '2'})
			.ele('data', {'key': 'label'}, 'B')
			.insertAfter('data', {'key': 'weight'}, '1.0')
		// Edge
		.up().up()
		.ele('edge', {'source': '1', 'target': '2'})
			.ele('data', {'key': 'label'}, 'A to B')
		
.end({ pretty: true});

console.log(xml);