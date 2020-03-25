const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    const sqlCheckIfTransExists = `
      SELECT id
      FROM transcriptions
      WHERE id = ?
    `;
    const [resultsCheckIfTransExists] = await mysql.query(sqlCheckIfTransExists, req.params.id);
    if (!resultsCheckIfTransExists.length) {
      res.status(404).send('Transcription doesn\'t exist');
      return;
    }
    const sql = `
      SELECT
        id,
        time_start,
        time_end,
        member_id,
        request_id,
        calling_number
      FROM participants
      WHERE transcription_id = ?
      ORDER BY time_start ASC
    `;
    const [results] = await mysql.query(sql, req.params.id);
    res.status(200).json(results);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
