import {Deepstream} from '@deepstream/server';

let deepstreamServer = new Deepstream({
	// @url https://deepstream.io/docs/server/configuration/
	serverName: 'data.sr-accelerator.com',
	showLogo: false,
	logLevel: 'INFO',
	httpServer: {
		type: 'default',
		urlPath: '/',
	},

	// Mongo storage setup
	storage: {
		name: 'mongodb',
		options: {
			connectionString: 'mongodb://localhost/deepstream',
			database: 'deepstream',
			defaultTable: 'deepstream',
		},
	},


	// Redis clustering
	clusterNode: {
		name: 'redis',
		options: {
			host: 'localhost',
			port: '6379',
		},
	},
});

deepstreamServer.start();
