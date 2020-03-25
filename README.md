# deepgram-conferencing-server [![Build Status](https://secure.travis-ci.org/davehorton/deepgram-conferencing-server.png)](http://travis-ci.org/davehorton/deepgram-conferencing-server)

An audio conferencing application that integrates with [Deepgram](https://deepgram.com) to provide transcriptions of conference audio.  The application also records conference audio and includes a simple web GUI and REST provisioning api.

## Installation
The application requires a mysql database with the [provided schema](db/schema.sql) used to create a database named 'deepgram'.

The application also requires a [drachtio server](https://drachtio.org) and Freeswitch (built using [this ansible role](https://github.com/davehorton/ansible-role-fsmrf) or equivalent).

For simplicity of installation, a [terraform](infrastructure/terraform) script is provided that deploys a server in an AWS VPC with all needed dependencies configured, using AWS Aurora to deploy a serverless mysql database.  This terraform script utilizes an AWS AMI built from [this packer script](infrastructure/packer).

## Configuration

The application requires these environment variables to be set (note: these are all set automatically when the terraform script is used):

- DEEPGRAM_USERNAME: the username needed to access the deepgram transcription endpoint
- DEEPGRAM_PASSWORD: the username needed to access the deepgram transcription endpoint
- DEEPGRAM_MYSQL_HOST: mysql hostname
- DEEPGRAM_MYSQL_USER: mysql username
- DEEPGRAM_MYSQL_PASSWORD: mysql password

## Tests
To run the included test suite for the REST provisioning api, you will need to have a mysql server installed on your laptop/server. You will need to set the MYSQL_ROOT_PASSWORD env variable to the mysql root password before running the tests.  The test suite creates a database and user in your mysql server to run the tests against, and removes it when done.  The database, user, and password are specified in config/local-test.json.
```
MYSQL_ROOT_PASSWORD=foobar npm test
```