import {SORT_PARAMS, FILTER_PARAMS} from '../actions/types';
const initialState = {
    sort:{
        column: 'created',
        order: -1
    },
    filter: {

    }
}

export default(state = initialState, actions) =>{
      //console.log(state)
    switch(actions.type){
        case SORT_PARAMS:
       // console.log(actions.payload)
            state.sort = actions.payload
        return state
        case FILTER_PARAMS:
         //console.log(actions.payload)        
           state.filter = actions.payload
        return state
        default:
        return state;
    }
}