INSERT INTO posts (postId, title, post) 
    values (%s,%s,%s) 
on duplicate key update 
    title = values(title),
    post = values(post),
    modified = now()