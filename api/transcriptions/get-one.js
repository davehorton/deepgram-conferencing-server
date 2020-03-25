const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    const sql = `
      SELECT
        id,
        time_start,
        time_end
      FROM transcriptions
      WHERE id = ?
    `;
    const [results] = await mysql.query(sql, req.params.id);
    if (!results.length) {
      res.status(404).send('Transcription doesn\'t exist');
      return;
    }
    res.status(200).json(results[0]);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
