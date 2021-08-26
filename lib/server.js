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
});

deepstreamServer.start();
