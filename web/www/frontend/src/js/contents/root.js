import Posts from 'contents/posts';
import Post from 'contents/post';

export const ContentDirectory = {
    posts : {
        url : '/posts',
        component : Posts
    },

    post : {
        url : '/post/:id',
        component : Post
    }
};