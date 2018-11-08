import {OPERATORS, OPERATOR} from '../actions/types';
const initialState = {
    operator: {}
}

export default(state = initialState, actions) =>{
      //console.log(state)
    switch(actions.type){
        case OPERATORS:
           //console.log(actions.payload.data)
           return actions.payload.data
        case OPERATOR: 
        //    state.operator = actions.payload.data
        // console.log(actions.payload)
        //   state.operator = {...state.operator, ...actions.payload}
        //   console.log(actions.payload.data)
           return {...state.operator, ...actions.payload.data}
        default:
        return state;
    }
}
