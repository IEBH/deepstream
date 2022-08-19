/**
* Main Deepstream setup file
* NOTE: 1. This requires an Nginx forward proxy as per the data.sr-accelerator.com rules in https://github.com/IEBH/SRA2/blob/master/units/server.nginx/nginx.conf
*       2. Because Nginx listens for port 6020 connections we have to move Deepstream to port 7020 so we can forward
*/

const serverName = 'data.sr-accelerator.com';
const port = process.env.PORT || 7020;

import {promises as fs} from 'node:fs';
import {Deepstream} from '@deepstream/server';

Promise.resolve()
	.then(()=> Promise.all([ // Try to fetch local SSL certs
		fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/privkey.pem', 'utf8')
			.catch(()=> false),
		fs.readFile('/etc/letsencrypt/live/sr-accelerator.com/cert.pem', 'utf8')
			.catch(()=> false),
	]))
	.then(([key, cert]) => {
		if (key && cert) return {key, cert};
		console.warn('No SSL key/cert found - running in non-encryption mode (ws://) only')
	})
	.then(ssl => new Deepstream({
		// @url https://deepstream.io/docs/server/configuration/
		serverName,
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
				port, // So Nginx can claim 6020 and forward internally to this
			},
			...(ssl ? {ssl} : {}), // Install SSL if we have it
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
	}))
	.then(deepstreamServer => deepstreamServer.start())
