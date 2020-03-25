module.exports = {
  apps : [
  {
    name: 'deepgram-conferencing',
    cwd: '/home/admin/apps/cautious-enigma',
    script: 'app.js',
    out_file: '/home/admin/.pm2/logs/cautious-enigma.log',
    err_file: '/home/admin/.pm2/logs/cautious-enigma.log',
    combine_logs: true,
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DEEPGRAM_WS_URL: 'https://cab2b5852c84ae12.deepgram.com/v2/listen/stream?encoding=linear16&sample_rate=8000',
      DEEPGRAM_MYSQL_HOST: '$${DEEPGRAM_MYSQL_HOST}',
      DEEPGRAM_MYSQL_USER: '$${DEEPGRAM_MYSQL_USER}',
      DEEPGRAM_MYSQL_PASSWORD: '$${DEEPGRAM_MYSQL_PASSWORD}',
      DEEPGRAM_MYSQL_DATABASE: 'DEEPGRAM',
      DEEPGRAM_MYSQL_CONNECTION_LIMIT: 10,
      DEEPGRAM_LOGLEVEL: 'info',
      DEEPGRAM_WELCOME_PROMPT: 'conference/conf-enter_conf_number.wav',
      DEEPGRAM_ERROR_PROMPT: 'conference/conf-bad-pin.wav',
      DEEPGRAM_GOODBYE_PROMPT: 'conference/conf-goodbye.wav',
      HTTP_PORT:  3000
		},
  }]
};