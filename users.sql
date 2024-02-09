CREATE TABLE IF NOT EXISTS `users_image` (
    `id` int(5) NOT NULL AUTO_INCREMENT,
    `main_heading` varchar(255) NOT NULL,
    `sub_heading` varchar(255) NOT NULL,
    `content` varchar(255) NOT NULL,
    `image1` varchar(255) NOT NULL,
    `image2` varchar(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
