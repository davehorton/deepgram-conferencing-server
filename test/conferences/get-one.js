const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Conferences > Get One', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/1234',
    });
    t.equal(response.statusCode, 404, 'Returns 404 when conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf/2',
    });
    delete response.body.date_created;
    t.deepEqual(
      response.body,
      {
        id: 2,
        meeting_pin: 222,
        description: 'A test conference',
        freeswitch_ip: null
      },
      'Confirmed that conference details are correct'
    );
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
