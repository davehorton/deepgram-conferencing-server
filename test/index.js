const test = require('tape');
const child_process = require('child_process');
const promisify = require('util').promisify;
const exec = promisify(child_process.exec);
const pwd = process.env.TRAVIS ? '' : '-p$MYSQL_ROOT_PASSWORD';
const { user, password, database } = {
  host: process.env.DEEPGRAM_MYSQL_HOST || 'localhost',
  user: process.env.DEEPGRAM_MYSQL_USER || 'deepgram',
  password: process.env.DEEPGRAM_MYSQL_PASSWORD || 'deepgram',
  database: process.env.DEEPGRAM_MYSQL_DATABASE || 'deepgram'
}; 
const app = require('../app');

//=============================================================================
// Create Database
//=============================================================================
test('Create Database', async(t) => {
  try {
    await exec(`mysql -h localhost -u root ${pwd} -e "DROP DATABASE IF EXISTS ${database}"`);
    await exec(`mysql -h localhost -u root ${pwd} -e "CREATE DATABASE ${database}"`);
    t.pass(`created test database ${database}`);
    await exec(`mysql -h localhost -u root ${pwd} -e "create user ${user}@localhost IDENTIFIED WITH mysql_native_password by '${password}'"`);
    await exec(`mysql -h localhost -u root ${pwd} -e "grant all on ${database}.* to ${user}@localhost"`);
    t.pass(`created user ${user}`);
    await exec(`mysql -h localhost -u root ${pwd} -D ${database} < ${__dirname}/../db/schema.sql`);
    t.pass('created schema');
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
});

//=============================================================================
// Conferences Tests
//=============================================================================
require('./conferences/create.js');
require('./conferences/get-all.js');
require('./conferences/get-one.js');
require('./conferences/update.js');
require('./conferences/delete.js');

//=============================================================================
// VoIP Tests
//=============================================================================
require('./voip/join-conference.js');
require('./voip/add-utterance.js');
require('./voip/end-transcription.js');

//=============================================================================
// Transcriptions Tests
//=============================================================================
require('./transcriptions/get-all.js');
require('./transcriptions/get-one.js');
require('./transcriptions/delete.js');

//=============================================================================
// Utterances Tests
//=============================================================================
require('./utterances/get-all.js');
//=============================================================================
// Drop Database
//=============================================================================
test('Drop Database', async(t) => {
  try {
    await exec(`mysql -h localhost -u root ${pwd} -e "DROP DATABASE ${database}"`);
    t.pass(`dropped test database ${database}`);
    await exec(`mysql -h localhost -u root ${pwd} -e "REVOKE ALL PRIVILEGES, GRANT OPTION FROM ${database}@localhost"`);
    await exec(`mysql -h localhost -u root ${pwd} -e "DROP USER ${database}@localhost"`);
    t.pass(`removed user ${user}`);
    t.end();
  } catch (err) {
    t.fail(err);
    t.end();
  }
  process.exit(0);
});
