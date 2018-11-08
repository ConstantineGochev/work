import {FETCH_USER} from '../actions/types'

var INITIAL_STATE = {};

export default function(state=INITIAL_STATE, action){
    console.log(action)
        switch (action.type) {
            case FETCH_USER:
            return action.payload.data

            default:
                return state;
        }
}