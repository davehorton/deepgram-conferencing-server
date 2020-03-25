const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Conferences > Create', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/conf',
      body: {
        'description': 'A test conference'
      },
    });
    t.equal(response.statusCode, 400, 'Returns 400 when meeting PIN is not provided');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/conf',
      body: {
        'meeting-pin': 111,
      },
    });
    t.equal(response.statusCode, 201, 'Returns 201 when meeting PIN is provided');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/conf',
      body: {
        'meeting-pin': 222,
        'description': 'A test conference'
      },
    });
    t.equal(response.statusCode, 201, 'Returns 201 when meeting PIN and description are provided');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/conf',
      body: {
        'meeting-pin': 111,
      },
    });
    t.equal(response.statusCode, 409, 'Returns 409 when meeting PIN is already in use');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
