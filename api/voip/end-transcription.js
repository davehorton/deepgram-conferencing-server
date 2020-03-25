const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
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

    // End active transcription and add recording file path
    const sqlEndTranscription = `
      UPDATE transcriptions
      SET
        time_end = ?,
        recording_path = ?
      WHERE conference_id = ?
      AND time_end IS NULL
    `;
    const sqlValuesEndTranscription = [
      new Date(),
      req.body['recording-path'],
      conferenceId,
    ];
    await mysql.query(sqlEndTranscription, sqlValuesEndTranscription);

    // Remove FreeSWITCH IP from current conferences
    const sqlRemoveFreeswitchIp = `
      UPDATE conferences
      SET freeswitch_ip = NULL
      WHERE id = ?
    `;
    await mysql.query(sqlRemoveFreeswitchIp, conferenceId);

    res.status(200).send('Transcription ended successfully');

  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
