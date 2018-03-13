import {combineReducers} from 'redux'
import SideNavOptions from './sidenav-options'
import EditText from './edit-text'

const rootReducer = combineReducers({
    options: SideNavOptions,
    text: EditText
})

export default rootReducer