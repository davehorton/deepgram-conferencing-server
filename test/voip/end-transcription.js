const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('VoIP > End Transcription', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/voip/end-transcription/333',
    });
    t.equal(response.statusCode, 404, 'Returns 404 if conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1',
    });
    response = await request({
      method: 'PUT',
      uri: '/voip/end-transcription/444',
    });
    t.equal(response.statusCode, 200, 'Returns 200 if transcription is ended successfully');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1',
    });
    t.notEqual(response.body.time_end, null, 'Confirmed that transcription has an end time');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
