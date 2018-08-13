CREATE DATABASE blog;
GRANT ALL PRIVILEGES ON blog.* TO 'web'@'localhost' IDENTIFIED BY 'password'
source tables/posts.sql;
source tables/user.sql;
