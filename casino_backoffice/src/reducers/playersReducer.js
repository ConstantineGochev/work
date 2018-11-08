import {PLAYERS, PLAYER} from '../actions/types';
const initialState = {
    player: {}
}

export default(state = initialState, actions) =>{
      //console.log(state)
    switch(actions.type){
        case PLAYERS:
           //console.log(actions.payload.data.data)
           return actions.payload.data.data
        case PLAYER:
           //console.log(actions.payload.data)
           return {...state.player, ...actions.payload.data}
 
        default:
        return state;
    }
}