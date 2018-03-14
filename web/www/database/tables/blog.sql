drop table posts;

create table posts (
    postId CHAR(38) NOT NULL,
    title VARCHAR(255) NOT NULL,
    post TEXT NOT NULL,
    created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    primary key(postId)
)