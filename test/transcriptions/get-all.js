const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Transcriptions > Get All', async(t) => {
  let response;
  try {
    //=============================================================================
    // Starting a transcription for use in tests below
    await request({
      method: 'POST',
      uri: '/voip/join-conference/444',
      body: {
        'freeswitch-ip': '10.0.0.101',
      },
    });
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/1/trans',
    });
    t.equal(response.statusCode, 404, 'Returns 404 if conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/2/trans',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for a conference with transcriptions');
    //=============================================================================
    t.equal(response.body.length, 2, 'Returns correct number of transcriptions');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/4/trans',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for a conference with no transcriptions');
    //=============================================================================
    t.equal(response.body.length, 0, 'Returns an empty array for a conference with no transcriptions');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
