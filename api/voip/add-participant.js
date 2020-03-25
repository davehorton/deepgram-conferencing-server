const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    if (!req.body['member-id']) {
      res.status(400).send('member-id required');
      return;
    }

    // Get Conference ID
    const sqlGetConferenceId = `
      SELECT id
      FROM conferences
      WHERE meeting_pin = ?
    `;
    const [conferenceIdResults] = await mysql.query(sqlGetConferenceId, req.params.pin);
    if (!conferenceIdResults.length) {
      res.status(404).send('Conference doesn\'t exist');
      return;
    }
    const conferenceId = conferenceIdResults[0].id;

    // Get transcription ID
    const sqlGetTranscriptionId = `
      SELECT id
      FROM transcriptions
      WHERE conference_id = ?
      AND time_end IS NULL
    `;
    const [transcriptionIdResults] = await mysql.query(sqlGetTranscriptionId, conferenceId);
    if (!transcriptionIdResults.length) {
      res.status(404).send('No active transcription');
      return;
    }
    const transcriptionId = transcriptionIdResults[0].id;

    const sqlAddParticipant = `
      INSERT INTO participants
        (member_id, transcription_id, calling_number)
      VALUES
        (?, ?, ?)
    `;

    const sqlValues = [
      req.body['member-id'],
      transcriptionId,
      req.body.callingNumber || 'anonymous'
    ];
    const results = await mysql.query(sqlAddParticipant, sqlValues);
    logger.info({results}, 'successfully inserted participant');
    res.status(200).json({id: results[0].insertId});

  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
