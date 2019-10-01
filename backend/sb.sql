--
-- Table structure for table `products`
--
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_name` varchar(128) NOT NULL,
  `user_email` varchar(128) NOT NULL,
  `user_password` varchar(128) NOT NULL,
  `user_image` BLOB NOT NULL
);

--
-- Table structure for table `products`
--
CREATE TABLE IF NOT EXISTS `skills` (
  `skill_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `skill_name` varchar(128) NOT NULL,
  `skill_image` BLOB NOT NULL
);

--
-- Table structure for table `abilities`
--
CREATE TABLE IF NOT EXISTS `abilities` (
  `ability_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ability_userid` int(11) NOT NULL,
  `ability_name` varchar(128) NOT NULL,  
  `ability_image` BLOB NOT NULL,
  `ability_skillid` int(11) NOT NULL
);

--
-- Table structure for table `tags`
--
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tag_name` varchar(128) NOT NULL,
  `tag_bgcolor` varchar(128) NOT NULL
);

--
-- Table structure for table `ability_tags`
--
CREATE TABLE IF NOT EXISTS `ability_tags` (
  `at_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `at_abilityid` int(11) NOT NULL,
  `at_tagid` int(11) NOT NULL
);


--
-- Table structure for table `ability_details`
--
CREATE TABLE IF NOT EXISTS `ability_details` (
  `ad_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ad_abilityid` int(11) NOT NULL,
  `ad_title` varchar(128) NOT NULL,
  `ad_desciption` MEDIUMTEXT NOT NULL,  
  `ad_tags` varchar(516) NOT NULL
);

