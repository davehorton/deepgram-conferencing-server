const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('VoIP > Join Conference', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/join-conference/444',
    });
    t.equal(response.statusCode, 400, 'Returns 400 if FreeSWITCH IP is not provided');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/join-conference/555',
      body: {
        'freeswitch-ip': '10.0.0.101',
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 if conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/join-conference/444',
      body: {
        'freeswitch-ip': '10.0.0.101',
      },
    });
    t.equal(response.statusCode, 201, 'Returns 201 (transcription started) if there is not one in progress');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/join-conference/444',
      body: {
        'freeswitch-ip': '10.0.0.102',
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 if there is a transcription in progress');
    //=============================================================================
    delete response.body.date_created;
    t.deepEqual(
      response.body,
      {
        'id': 2,
        'meeting_pin': 444,
        'description': 'Updating the description again',
        'freeswitch_ip': '10.0.0.101'
      },
      'Confirmed that first caller\'s FreeSWITCH IP is sent to second caller'
    );
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
