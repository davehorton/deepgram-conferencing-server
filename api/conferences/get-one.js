const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    const sql = `
      SELECT
        id,
        date_created,
        meeting_pin,
        description,
        freeswitch_ip
      FROM conferences
      WHERE id = ?
    `;
    const [results] = await mysql.query(sql, req.params.id);
    if (!results.length) {
      res.status(404).send('Conference doesn\'t exist');
      return;
    }
    res.status(200).json(results[0]);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
