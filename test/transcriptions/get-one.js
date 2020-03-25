const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Transcriptions > Get One', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1234',
    });
    t.equal(response.statusCode, 404, 'Returns 404 if transcription doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for completed transcription');
    //=============================================================================
    if (
      (response.body.time_start) &&
      (response.body.time_end)
    ) {
      t.pass('Completed transcription has a start and end time');
    } else {
      t.fail('Completed transcription has a start and end time');
    }
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/2',
    });
    t.equal(response.statusCode, 200, 'Returns 200 for in-progress transcription');
    //=============================================================================
    if (
      (response.body.time_start) &&
      (!response.body.time_end)
    ) {
      t.pass('In-progress transcription has a start time, but end time is null');
    } else {
      t.fail('In-progress transcription has a start time, but end time is null');
    }
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
