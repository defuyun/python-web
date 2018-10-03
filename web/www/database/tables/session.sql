drop table session;

create table session (
	sessionId CHAR(40) not null,
	userId CHAR(38) not null,
	userAgent VARCHAR(255) not null,
	expire datetime not null,
	primary key(sessionId)
) character set = utf8;
