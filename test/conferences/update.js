const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('Conferences > Update', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/2',
      body: {
        'description': 'Updating the description',
      },
    });
    t.equal(response.statusCode, 400, 'Returns 400 when meeting PIN is not provided');
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/1234',
      body: {
        'meeting-pin': 333,
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 when conference doesn\'t exist');
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/2',
      body: {
        'meeting-pin': 111,
      },
    });
    t.equal(response.statusCode, 409, 'Returns 409 when meeting PIN is used by a different conference');
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/2',
      body: {
        'meeting-pin': 333,
        'description': 'A test conference',
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 when changing meeting PIN and providing same description');
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/2',
      body: {
        'meeting-pin': 333,
        'description': 'Updating the description',
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 when changing description and providing same meeting PIN');
    //=============================================================================
    response = await request({
      method: 'PUT',
      uri: '/conf/2',
      body: {
        'meeting-pin': 444,
        'description': 'Updating the description again',
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 when changing both description and meeting PIN');
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
        meeting_pin: 444,
        description: 'Updating the description again',
        freeswitch_ip: null
      },
      'Confirmed that conference details were updated correctly'
    );
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
