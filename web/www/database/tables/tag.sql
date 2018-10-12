drop table tag;

create table tag (
	relId CHAR(40) NOT NULL,
	postId CHAR(38) NOT NULL,
	tagname VARCHAR(255) not null,
	primary key(relId),
	unique(postId, tagname)
) character set = utf8;
