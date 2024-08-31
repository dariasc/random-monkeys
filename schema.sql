CREATE TABLE `user` (
    `id` TEXT PRIMARY KEY,
    `username` TEXT CHECK( 10 <= LENGTH(`username`) AND LENGTH(`username`) <= 30 ) NOT NULL,
    `password` TEXT NOT NULL
);

CREATE TABLE `monkey_box` (
    `id` TEXT PRIMARY KEY,
    `organizer` TEXT NOT NULL,
    `privacy` TEXT CHECK(`privacy` IN ('PUBLIC', 'SEMI', 'PRIVATE')) NOT NULL,
    `state` TEXT CHECK(`state` IN ('OPEN', 'PUBLISHED')) DEFAULT ``,
    `publish_at` INTEGER CHECK(current_timestamp < `publish_at`) NOT NULL,
    FOREIGN KEY(`organizer`) REFERENCES `user`(`id`)
);

CREATE TABLE `monkey` (
    `id` TEXT PRIMARY KEY,
    `box` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `weight` FLOAT NOT NULL DEFAULT 1,
    FOREIGN KEY(`box`) REFERENCES `monkey_box`(`id`)  
);

CREATE TABLE `monkey_secrets` (
    `monkey` TEXT NOT NULL,
    `salt` TEXT NOT NULL,
    FOREIGN KEY(`monkey`) REFERENCES `monkey`(`id`)
);

CREATE TABLE `results` (
    `box` TEXT NOT NULL,
    `public_value` TEXT NOT NULL,
    FOREIGN KEY(`box`) REFERENCES `monkey_box`(`id`)
);
