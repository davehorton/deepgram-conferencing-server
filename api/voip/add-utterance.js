const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    if (!req.body.speech) {
      res.status(400).send('Speech required');
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

    // Calculate sequence number
    let seq = 1;
    const sqlGetSeq = `
      SELECT seq
      FROM utterances
      WHERE transcription_id = ?
      ORDER BY seq DESC
      LIMIT 1
    `;
    const [prevSeqResults] = await mysql.query(sqlGetSeq, transcriptionId);
    if (prevSeqResults.length) {
      seq = prevSeqResults[0].seq + 1;
    }

    const sqlAddUtterance = `
      INSERT INTO utterances
        (seq, speech, start, duration, confidence, member_id, transcription_id)
      VALUES
        (?, ?, ?, ?, ?, ?, ?)
    `;
    const sqlValuesAddUtterance = [
      seq,
      req.body.speech,
      req.body.start,
      req.body.duration,
      req.body.confidence,
      req.body['member-id'],
      transcriptionId
    ];
    await mysql.query(sqlAddUtterance, sqlValuesAddUtterance);
    res.status(200).send('Utterance added successfully');

  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
