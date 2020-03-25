const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Conferences > Get All', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/conf',
    });
    t.equal(response.body.length, 2, 'Confirmed that 2 conferences exist');
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
