drop table user;

create table user (
    userId CHAR(38) not null,
    username VARCHAR(255) not null,
    password CHAR(40) not null,
    email VARCHAR(255) not null,
    expire datetime not null,
    primary key(userId),
    unique(username)
) character set = utf8;