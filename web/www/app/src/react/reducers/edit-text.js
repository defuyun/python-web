export default (state = '', action) => {
    switch(action.type) {
        case 'EDITOR_CHANGE_INPUT':
            return action.text
        default:
            return state
    }
}