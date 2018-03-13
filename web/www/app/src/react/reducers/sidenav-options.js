export default (state = [], action) => {
    switch (action.type) {
        case 'FETCH_SIDENAV_OPTIONS_SUCCESS':
            return action.options
        default:
            return state
    }
}