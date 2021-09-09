import {DeepstreamClient} from '@deepstream/client';
import {expect} from 'chai';
import {promisify} from 'node:util';

let deepstreamUri = process.env.DEEPSTREAM || 'data.sr-accelerator.com:6020';
let sessionId = Date.now();

describe('Basic Deepstream testing', ()=> {

	let client;
	before('client setup', async function() {
		this.timeout(5 * 1000);
		client = new DeepstreamClient(deepstreamUri);
		await client.login();
	})

	after('client teardown', async ()=> {
		if (client) await client.close();
	});


	it('should have a UID', async ()=> {
		let uid = await client.getUid();
		expect(uid).to.be.a('string');
	});


	it('websockets - should provide simple getter / setters', async function() {
		this.timeout(5 * 1000);

		let record = client.record.getRecord(`test/${sessionId}`);

		await promisify(record.set.bind(record))('testString', 'Hello World');

		expect(await record.get('testString')).to.equal('Hello World');
	});

});
