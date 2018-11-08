import {CHAT} from '../actions/types';

const initialState = [];
export default function(state = initialState , actions) {
    switch (actions.type) {
        case CHAT:
           // console.log(actions.payload)
            state = actions.payload
            return state
    
        default:
            return state;
    }
}