const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    const sql = `
      SELECT recording_path
      FROM transcriptions
      WHERE id = ?
    `;
    const [results] = await mysql.query(sql, req.params.id);
    if (!results.length) {
      res.status(404).send('Transcription doesn\'t exist');
      return;
    }
    if (!results[0].recording_path) {
      res.status(404).send('No audio available for this transcription');
      return;
    }
    res.status(200).download(results[0].recording_path);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
