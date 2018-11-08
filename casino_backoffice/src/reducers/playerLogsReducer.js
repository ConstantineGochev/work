import {PLAYER_LOGS} from '../actions/types';
const initialState = {}

export default(state = initialState, actions) =>{
      //console.log(state)
    switch(actions.type){
        case PLAYER_LOGS:
           //console.log(actions.payload.data)
           return actions.payload.data.data
        default:
        return state;
    }
}