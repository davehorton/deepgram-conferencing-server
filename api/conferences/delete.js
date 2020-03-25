const mysql = require('../../db/mysql');
const logger = require('../../utils/logger');
const {execSync} = require('child_process');

module.exports = async(req, res) => {
  try {
    const sqlCheckIfExists = `
      SELECT id
      FROM conferences
      WHERE id = ?
    `;
    const [resultsCheckIfExists] = await mysql.query(sqlCheckIfExists, req.params.id);
    if (!resultsCheckIfExists.length) {
      res.status(404).send('Conference doesn\'t exist');
      return;
    }

    // Find all transcriptions with this conference ID that have a recording
    const sqlFindTranscriptions = `
      SELECT recording_path
      FROM transcriptions
      WHERE conference_id = ?
      AND recording_path IS NOT NULL
    `;
    const [resultsFindTranscriptions] = await mysql.query(sqlFindTranscriptions, req.params.id);
    const files = resultsFindTranscriptions.map((result) => result.recording_path);

    // Delete all files associated with transcriptions
    files.forEach(async(file) => {
      try {
        execSync(`sudo rm ${file}`);
      } catch (err) {
        if (err.message.includes('ENOENT: no such file or directory')) {
          logger.warn(`Was going to delete file "${file}", but it doesn't exist.`);
        } else {
          throw err;
        }
      }
    });

    // Delete from database
    const sqlDelete = `
      DELETE FROM conferences
      WHERE id = ?
    `;
    await mysql.query(sqlDelete, req.params.id);
    res.status(200).send('Conference deleted');
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};
