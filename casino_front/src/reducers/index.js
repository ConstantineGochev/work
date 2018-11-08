import {combineReducers} from 'redux';
import loginReducer from './loginReducer'
import gamesReducer from './gameReducer'



const rootReducer = combineReducers({
    login: loginReducer,
    games: gamesReducer
})

export default rootReducer