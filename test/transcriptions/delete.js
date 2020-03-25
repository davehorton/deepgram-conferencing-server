const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Transcriptions > Delete', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'DELETE',
      uri: '/trans/1234',
      body: {
        'meeting-pin': 333,
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 when transcriptions doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/2/trans',
    });
    //=============================================================================
    response = await request({
      method: 'DELETE',
      uri: '/trans/2',
    });
    t.equal(response.statusCode, 200, 'Returns 200 when transcription deleted successfully');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/2/trans',
    });
    t.equal(response.body.length, 1, 'Confirmed that there is only 1 transcription left');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
