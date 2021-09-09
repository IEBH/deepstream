import {promises as fs} from 'node:fs';
import {Deepstream} from '@deepstream/server';

let ssl = await Promise.all([
	fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/privkey.pem'),
	fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/cert.pem'),
	fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/fullchain.pem'),
])
	.then(([key, cert, ca]) => ({key, cert, ca}))

let deepstreamServer = new Deepstream({
	// @url https://deepstream.io/docs/server/configuration/
	serverName: 'data.sr-accelerator.com',
	showLogo: false,
	logLevel: 'INFO',
	httpServer: {
		type: 'default',
		urlPath: '/',
		options: {
			allowAllOrigins: true,
		},
		ssl,
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
