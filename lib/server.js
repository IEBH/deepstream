/**
* Main Deepstream setup file
* NOTE: 1. This requires an Nginx forward proxy as per the data.sr-accelerator.com rules in https://github.com/IEBH/SRA2/blob/master/units/server.nginx/nginx.conf
*       2. Because Nginx listens for port 6020 connections we have to move Deepstream to port 7020 so we can forward
*/

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

	telemetry: {
		enabled: false,
	},

	httpServer: {
		type: 'default',
		urlPath: '/',
		options: {
			allowAllOrigins: true,
			port: 7020, // So Nginx can claim 6020 and forward internally to this
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
