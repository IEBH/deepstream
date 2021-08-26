import {DeepstreamClient} from '@deepstream/client';
import {expect} from 'chai';

let deepstreamUri = 'data.sr-accelerator.com:6020';
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

		record.set('testString', 'Hello World', err => {
			console.log('WRITTEN', err);
		});

		console.log('GOT', await record.get('testString'));

		return;
		// Doc shouldn't exist yet
		/*
		console.log('PREHAS');
		expect(await client.record.has(`test/${sessionId}`)).to.be.equal(false);
		console.log('POSTHAS');
		*/

		// Create subscription
		console.log('PREGET');
		let doc = await client.record.getRecord(`test/${sessionId}`)
		console.log('PRESUB');
		let sub = doc.subscribe();
		console.log('SUB', doc);

		// Key shouldn't exist yet
		expect(await doc.has('stringTest')).to.be.equal(false);

		// Set string
		await doc.set('stringTest', 'Hello World');
		expect(await doc.has('stringTest')).to.be.equal(false);
		let fetchedValue = await doc.get('stringTest');
	});

});
