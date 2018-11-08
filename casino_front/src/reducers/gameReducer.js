import {GAME_ID} from '../actions/types'

// var INITIAL_STATE = {
//     games: []
// };

export default function(state={}, action){
    console.log(action)
        switch (action.type) {
            case GAME_ID:
            console.log(action.payload.games)
           // console.log(action.payload.data.data)
            return action.payload.games//state.games.push(action.payload.data)//[...state.games, ...action.payload.data]

            default:
                return state;
        }
}