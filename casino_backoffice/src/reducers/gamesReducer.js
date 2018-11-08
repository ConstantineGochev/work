import {GAMES} from '../actions/types';

const initialState = '';
export default function(state = initialState , actions) {
    switch (actions.type) {
        case GAMES:
            //console.log(actions.payload.data)
            let newStateArray = Array.from(Object.keys(actions.payload.data), k => actions.payload.data[k]);
            return newStateArray[0]//[...state, actions.payload.data]
    
        default:
            return state;
    }
}