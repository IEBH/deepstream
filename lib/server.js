import {promises as fs} from 'node:fs';
import {Deepstream} from '@deepstream/server';

let ssl = await Promise.all([
	fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/privkey.pem', 'utf8'),
	fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/cert.pem', 'utf8'),
])
	.then(([key, cert]) => ({key, cert}))

let deepstreamServer = new Deepstream({
	// @url https://deepstream.io/docs/server/configuration/
	serverName: 'data.sr-accelerator.com',
	showLogo: false,
	logLevel: 'DEBUG',
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
