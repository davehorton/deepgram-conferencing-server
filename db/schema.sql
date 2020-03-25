CREATE TABLE `conferences`
  (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `date_created`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `meeting_pin`       INT NOT NULL UNIQUE,
    `description`       VARCHAR(255),
    `freeswitch_ip`     VARCHAR(21),
    PRIMARY KEY (`id`)
  );

CREATE TABLE `transcriptions`
  (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `time_start`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `time_end`          TIMESTAMP NULL DEFAULT NULL,
    `recording_path`    VARCHAR(255),
    `conference_id`     INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`conference_id`) REFERENCES conferences(`id`)
    ON DELETE CASCADE
  );

CREATE TABLE `utterances`
  (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `seq`               INT NOT NULL,
    `speech`            TEXT NOT NULL,
    `start`             DECIMAL(12,6),
    `start_timestamp`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `duration`          DECIMAL(12,6),
    `confidence`        DECIMAL(12,6),
    `member_id`         INT,
    `transcription_id`  INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`seq`, `transcription_id`),
    FOREIGN KEY (`transcription_id`) REFERENCES transcriptions(`id`)
    ON DELETE CASCADE
  );

CREATE TABLE `participants`
  (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `time_start`        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `time_end`          TIMESTAMP,
    `member_id`         INT NOT NULL,
    `request_id`        VARCHAR(128),
    `calling_number`    VARCHAR(128),
    `transcription_id`  INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`member_id`, `transcription_id`),
    FOREIGN KEY (`transcription_id`) REFERENCES transcriptions(`id`)
    ON DELETE CASCADE
  );
