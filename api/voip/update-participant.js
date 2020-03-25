const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');

module.exports = async(req, res) => {
  try {
    if (!req.body['request-id']) {
      res.status(400).send('request-id required');
      return;
    }

    const sqlUpdateParticipant =
      'UPDATE participants set request_id = ?, time_end = CURRENT_TIMESTAMP WHERE id = ?';

    const sqlValues = [
      req.body['request-id'],
      req.params.id
    ];
    const results = await mysql.query(sqlUpdateParticipant, sqlValues);
    logger.info({results}, 'successfully inserted participant');
    res.status(200).json({id: results[0].insertId});

  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
