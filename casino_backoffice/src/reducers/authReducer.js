import {AUTH_USER, AUTH_ERROR} from '../actions/types';

const INITIAL_STATE = {
    authenticated: '',
    user_name: '',
    errorMsg: ''
}

export default function(state = INITIAL_STATE, actions) {
    switch (actions.type) {
        case AUTH_USER:
            state.errorMsg = ''
           // console.log(actions.payload)
            state.user_name = actions.payload.user_name
            return {...state, authenticated: actions.payload.token}
        case AUTH_ERROR: 
        //console.log(actions.payload)
            return {...state, errorMsg: actions.payload}
    
        default:
            return state;
    }
}