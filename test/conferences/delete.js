const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Conferences > Delete', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'DELETE',
      uri: '/conf/1234',
      body: {
        'meeting-pin': 333,
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 when conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'DELETE',
      uri: '/conf/1',
    });
    t.equal(response.statusCode, 200, 'Returns 200 when conference deleted successfully');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf',
    });
    t.equal(response.body.length, 1, 'Confirmed that there is only 1 conference left');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
