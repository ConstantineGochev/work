import {REQUESTS, SORT_PARAMS} from '../actions/types';
const initialState = {
    // params:{
    //     column: 'created',
    //     order: -1
    // }
}

export default(state = initialState, actions) =>{
      //console.log(state)
    switch(actions.type){
        case REQUESTS:
           //console.log(actions.payload.data)
           return actions.payload.data
        // case SORT_PARAMS:
        // console.log(actions.payload)
        //     state.params = actions.payload
        // return state
        default:
        return state;
    }
}