const Emitter = require('events');
const moment = require('moment');
const execSync = require('child_process').execSync;
const {apiJoinConference,
  apiAddUtterance,
  apiAddParticipant,
  apiUpdateParticipant,
  apiCloseConference
} = require('./apis');

class CallSession extends Emitter {
  constructor(logger, req, res) {
    super();
    this.req = req;
    this.res = res;
    this.logger = logger.child({'Call-ID': req.get('Call-ID'), caller: req.callingNumber});
    this.ms = req.locals.ms;
  }

  get meeting_pin() {
    const arr = /conf-(.*)/.exec(this.confPin);
    return arr[1];
  }

  async exec() {
    try {
      await this._connectToMs();
      const createConference = await this._promptForMeetingId();
      if (createConference) {
        await this._createConference();
      }
      else {
        const {memberId} = await this.ep.join(this.confPin);
        this.memberId = memberId;
        this.logger.info(`joined existing conference as member id ${memberId}`);
      }
      const { id } = await apiAddParticipant(this.logger, this.meetingPin, this.memberId, this.req.callingNumber);
      this.participantId = id;
      this.logger.info(`added participant id ${id}`);
      await this._forkAudio();
    } catch (err) {
      if (err.message !== 'hangup') this.logger.error(err);
    }
  }

  async _connectToMs() {
    try {
      const {endpoint, dialog} = await this.ms.connectCaller(this.req, this.res);
      this.logger.info('successfully connected caller to ivr');
      this.ep = endpoint;
      this.dlg = dialog;
      this.dlg.on('destroy', this._onHangup.bind(this));
      await this.ep.play('silence_stream://1000');
    } catch (err) {
      this.logger.error(err, 'Error connecting to media server');
      this.res.send(480);
      throw err;
    }
  }

  async _promptForMeetingId() {
    for (let i = 0; i < 3; i++) {
      try {
        if (i > 0) await this.ep.play(process.env.DEEPGRAM_ERROR_PROMPT);
        const { digits } = await this.ep.playCollect({ file: process.env.DEEPGRAM_WELCOME_PROMPT, min: 1, max: 15 });
        this.logger.debug(`collected meeting pin ${digits}`);
        const { id, meeting_pin, freeswitch_ip } = await apiJoinConference(this.logger, digits, this.ms.address);
        this.confPin = `conf-${meeting_pin}`;
        this.meetingPin = digits;
        this.confMsAddress = freeswitch_ip;
        this.conferenceId = id;
        this.logger.debug(`conference_id: ${id}, meeting_pin ${this.confPin}, freeswitch_ip: ${freeswitch_ip}`);
        await this.ep.play('conference/conf-welcome.wav');
        return this.confMsAddress === null ? true : false;
      } catch (err) {
        if (err.message === 'hangup') throw err;
        if (err.statusCode !== 404) {
          this.logger.error(err, 'Error collecting/validating pin');
          this._hangup();
          throw err;
        }
      }
    }
    this.logger.info('invalid pin, max retries');
    this._hangup();
    throw new Error('max retries');
  }

  async _createConference() {
    try {

      // create conference, join the caller to it and start recording
      this.logger.info(`creating conference ${this.confPin}`);
      this.conference = await this.ms.createConference(this.confPin);
      this.conference.on('delMember', async(evt) => {
        if (this._isConferenceEmpty(evt)) this._closeConference();
      });
      const {memberId} = await this.ep.join(this.conference);
      this.memberId = memberId;
      this.logger.info(`joined new conference as member id ${memberId}`);
    }
    catch (err) {
      this.logger.error(err, 'Error creating conference');
      this._hangup(true);
      return;
    }

    try {
      // start recording the conference
      this.confRecordingPath =
        `/tmp/${this.confPin}-${moment().format()}.mp3`
          .replace(/\+/g, '-')
          .replace(/\:/g, '-');
      this.logger.info(`start recording to file: ${this.confRecordingPath}`);
      await this.conference.startRecording(this.confRecordingPath);

      // commented out since we are transcribing each leg separately
      //await this._transcribeConferenceMix();
    } catch (err) {
      this.logger.error(err, 'Error with streaming, continuing conference');
      if (this.wsConfEndpoint) this.wsConfEndpoint.destroy();
      if (this.wsStreamEndpoint) this.wsStreamEndpoint.destroy();
    }
  }

  async _forkAudio() {
    try {
      const url = process.env.DEEPGRAM_WS_URL;
      this.logger.info(`forking audio to websocket server at ${url}`);
      this.ep.addCustomEventListener('mod_audio_fork::connect', (evt) => {
        this.wsConnect = true;
        this.logger.info('successfully connected to websocket server');
      });
      this.ep.addCustomEventListener('mod_audio_fork::connect_failed', (evt) => {
        this.logger.error('received mod_audio_fork::connect_failed event');
      });
      this.ep.addCustomEventListener('mod_audio_fork::json', async(evt) => {
        if (evt.is_final) {
          this.logger.info(evt, `member id ${this.memberId} received mod_audio_fork::json event`);
          await apiAddUtterance(this.logger, this.meeting_pin, Object.assign(evt, {'member-id': this.memberId}));
        }
        else if (evt.request_id) {
          await apiUpdateParticipant(this.logger, this.participantId, evt.request_id);
        }
      });
      this.ep.addCustomEventListener('mod_audio_fork::disconnect', () => {
        this.wsConnect = false;
        if (this.shutdownInProgress) {
          this.logger.info('completed graceful shutdown');
          this.ep.destroy();
        }
      });

      if (process.env.DEEPGRAM_USERNAME && process.env.DEEPGRAM_PASSWORD) {
        await this.ep.set({
          MOD_AUDIO_BASIC_AUTH_USERNAME: process.env.DEEPGRAM_USERNAME,
          MOD_AUDIO_BASIC_AUTH_PASSWORD: process.env.DEEPGRAM_PASSWORD
        });
      }
      await this.ep.forkAudioStart({
        wsUrl: url,
        mixType: 'mono',
        sampling: '8000'
      });
    } catch (err) {
      this.logger.error(err, 'Error forking audio');
    }
  }

  /* we are not using this, since we are transcribing each leg separately
     but if desired to send one mixed conference stream for transcribing
     here is what would be done
  */
  async _transcribeConferenceMix() {
    this.wsConfEndpoint = await this.ms.createEndpoint();
    await this.wsConfEndpoint.join(this.confPin, {flags: {ghost: true, mute: true}});
    this.wsStreamEndpoint = await this.ms.createEndpoint();
    await this.wsConfEndpoint.modify(this.wsStreamEndpoint.local.sdp);
    await this.wsStreamEndpoint.modify(this.wsConfEndpoint.local.sdp);

    this.wsStreamEndpoint.addCustomEventListener('mod_audio_fork::connect', (evt) => {
      this.logger.info('successfully connected to websocket server');
    });
    this.wsStreamEndpoint.addCustomEventListener('mod_audio_fork::connect_failed', (evt) => {
      this.logger.error('received mod_audio_fork::connect_failed event');
    });
    this.wsStreamEndpoint.addCustomEventListener('mod_audio_fork::json', async(evt) => {
      if (evt.is_final) {
        this.logger.info(evt, 'received mod_audio_fork::json event');
        await apiAddUtterance(this.logger, this.meeting_pin, evt);
      }
    });

    // fork conference audio between the two endpoints to the websocket server
    const url = process.env.DEEPGRAM_WS_URL;
    this.logger.info(`forking audio to websocket server at ${url}`);
    await this.wsStreamEndpoint.forkAudioStart({
      wsUrl: url,
      mixType: 'mono',
      sampling: '8000'
    });
  }

  _hangup(playError) {
    this.dlg.destroy();
    this.ep.destroy();
  }

  _onHangup() {
    this.logger.info('caller hung up');
    if (!this.wsConnect) {
      this.ep.destroy();
      return;
    }

    // caller hung up; send zero-length binary frame to get final transcription
    this.shutdownInProgress = true;
    this.ep.api('uuid_audio_fork', [this.ep.uuid, 'graceful-shutdown'], (err, evt) => {
      if (err) return this.logger.err(err, 'Error graceful close');
      this.logger.info('sent graceful shutdown');
    });
  }

  _isConferenceEmpty(evt) {
    return parseInt(evt.getHeader('Conference-Size')) === 1;
  }

  async _closeConference() {
    this.logger.info('destroying conference after last participant left');
    await apiCloseConference(this.logger, this.meeting_pin, this.confRecordingPath);
    this.conference.destroy();
    if (this.wsConfEndpoint) this.wsConfEndpoint.destroy();
    if (this.wsStreamEndpoint) this.wsStreamEndpoint.destroy();
    execSync(`sudo chmod a+r ${this.confRecordingPath}`);
  }

}

module.exports = CallSession;
