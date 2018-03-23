export const sidenavOptionsApi = '/sidenav_options'
export const getPostsApi = '/posts'
export const getPostApi = '/posts/'

export const routeToMenuKey = (route) => {
    if(route.match(/^\/posts/)) {
        return 'Posts'
    }

    if(route.match(/^\/edit$/)) {
        return 'Edit'
    }

    if(route.match(/^\/login$/)) {
        return 'Login'
    }

    if(route.match(/^\/register$/)) {
        return 'Register'
    }

    if(route.match(/^\/home$/)) {
        return 'Home'
    }

    if(route.match(/^\/tags$/)) {
        return 'Tags'
    }
}