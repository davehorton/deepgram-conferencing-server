const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');
const {execSync} = require('child_process');

module.exports = async(req, res) => {
  try {
    const sql = `
      SELECT id, recording_path
      FROM transcriptions
      WHERE id = ?
    `;
    const [results] = await mysql.query(sql, req.params.id);
    if (!results.length) {
      res.status(404).send('Transcription doesn\'t exist');
      return;
    }

    // Delete recording files
    try {
      if (results[0].recording_path) execSync(`sudo rm ${results[0].recording_path}`);
    } catch (err) {
      if (err.message.includes('ENOENT: no such file or directory')) {
        logger.warn(`Was going to delete file "${results[0].recording_path}", but it doesn't exist.`);
      } else {
        throw err;
      }
    }


    // Delete from database
    const sqlDelete = `
      DELETE FROM transcriptions
      WHERE id = ?
    `;
    await mysql.query(sqlDelete, req.params.id);
    res.status(200).send('Transcription deleted');
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
