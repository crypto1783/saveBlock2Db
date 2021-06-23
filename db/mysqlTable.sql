CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(32) NOT NULL,
  `method` varchar(32) NOT NULL,
  `extrinsic` varchar(255) DEFAULT NULL,
  `index` varchar(32) DEFAULT NULL,
  `block_hash` varchar(128) DEFAULT NULL,
  `block_num` int(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


CREATE TABLE `event_params` (
  `id` int NOT NULL AUTO_INCREMENT,
  `index` int DEFAULT NULL,
  `event_id` varchar(64) DEFAULT NULL,
  `type` varchar(32) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `ticket_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `method` varchar(32) DEFAULT NULL,
  `section` varchar(32) DEFAULT NULL,
  `ticket_index` varchar(32) DEFAULT NULL,
  `ticket_hash` varchar(32) DEFAULT NULL,
  `extrinsic_hash` varchar(255) DEFAULT NULL,
  `block_hash` varchar(128) DEFAULT NULL,
  `block_num` int(32) DEFAULT NULL,
  `info` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


CREATE TABLE `blocks` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `block_hash` varchar(128) NOT NULL,
  `block_num` varchar(128) NOT NULL,
  `parent_hash` varchar(128) DEFAULT NULL,
  `state_root` varchar(128) DEFAULT NULL,
  `extrinsic_root` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
  