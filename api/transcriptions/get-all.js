const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    const sqlCheckIfConfExists = `
      SELECT id
      FROM conferences
      WHERE id = ?
    `;
    const [resultsCheckIfConfExists] = await mysql.query(sqlCheckIfConfExists, req.params.id);
    if (!resultsCheckIfConfExists.length) {
      res.status(404).send('Conference doesn\'t exist');
      return;
    }
    const sql = `
      SELECT
        id,
        time_start,
        time_end
      FROM transcriptions
      WHERE conference_id = ?
      ORDER BY time_start DESC
    `;
    const [results] = await mysql.query(sql, req.params.id);
    res.status(200).json(results);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
