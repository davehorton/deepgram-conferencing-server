const request = require('request-promise-native').defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true,
  resolveWithFullResponse: true,
  simple: false
});
const test = require('tape');

test('VoIP > Add Utterance', async(t) => {
  let response;
  try {
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/add-utterance/444',
      body: {
        start: 3.829193,
        duration: 2.338891,
        confidence: 0.987654,
        'member-id': 4
      },
    });
    t.equal(response.statusCode, 400, 'Returns 400 if speech is not provided');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/add-utterance/555',
      body: {
        speech: 'Hello',
        start: 3.829193,
        duration: 2.338891,
        confidence: 0.987654,
        'member-id': 4
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 if conference doesn\'t exist');
    //=============================================================================
    await request({
      method: 'POST',
      uri: '/conf',
      body: {
        'meeting-pin': 555,
        'description': 'Another test conference'
      },
    });
    response = await request({
      method: 'POST',
      uri: '/voip/add-utterance/555',
      body: {
        speech: 'Hello',
        start: 3.829193,
        duration: 2.338891,
        confidence: 0.987654,
        'member-id': 4
      },
    });
    t.equal(response.statusCode, 404, 'Returns 404 if there is no active transcription on the given conference');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/add-utterance/444',
      body: {
        speech: 'Hello',
        start: 3.829193,
        duration: 2.338891,
        confidence: 0.987654,
        'member-id': 4
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 if utterance is added successfully');
    //=============================================================================
    response = await request({
      method: 'POST',
      uri: '/voip/add-utterance/444',
      body: {
        speech: 'Hi back',
        start: 4.282929,
        duration: 3.222222,
        confidence: 0.555444,
        'member-id': 5
      },
    });
    t.equal(response.statusCode, 200, 'Returns 200 when a second utterance is added');
    //=============================================================================
    response = await request({
      method: 'GET',
      uri: '/trans/1/utter',
    });
    response.body.forEach(utter => {
      delete utter.start_timestamp;
    });
    t.deepEqual(
      response.body,
      [
        {
          seq: 1,
          speech: 'Hello',
          start: '3.829193',
          duration: '2.338891',
          confidence: '0.987654',
          member_id: 4
        },
        {
          seq: 2,
          speech: 'Hi back',
          start: '4.282929',
          duration: '3.222222',
          confidence: '0.555444',
          member_id: 5
        }
      ],
      'Confirmed that utterances retrieved from API match what was provided'
    );
    //=============================================================================
    t.end();
  } catch (err) {
    t.end(err);
  }
});
