import {combineReducers} from 'redux';
import playersReducer from './playersReducer'
import playerLogsReducer from './playerLogsReducer'
import requestsReducer from './requestsReducer'
// import {reducer as formReducer} from 'redux-form'
import operatorsReducer from './operatorsReducer'
import gamesReducer from './gamesReducer'
import paramsReducer from './paramsReducer'
import authReducer from './authReducer'
import chatReducer from './chatReducer'
//console.log(playerLogsReducer)
export default combineReducers({
    //state: (state = {}) => state,
    player_logs: playerLogsReducer,
    players: playersReducer,
    requests: requestsReducer,
    operators: operatorsReducer,
    games: gamesReducer,
    params: paramsReducer,
    auth: authReducer,
    msgs: chatReducer
})