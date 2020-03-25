const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Utterances > Get All', async(t) => {
  let response;
  try {
    //=============================================================================
    // Starting a transcription for use in tests below
    await request({
      method: 'POST',
      uri: '/voip/join-conference/555',
      body: {
        'freeswitch-ip': '10.0.0.102',
      },
    });
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/4/utter',
    });
    t.equal(response.statusCode, 404, 'Returns 404 if transcription doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1/utter',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for a transcription with utterances');
    //=============================================================================
    t.equal(response.body.length, 2, 'Returns correct number of utterances');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/3/utter',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for a transcription with no utterances');
    //=============================================================================
    t.equal(response.body.length, 0, 'Returns an empty array for a transcription with no utterances');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
