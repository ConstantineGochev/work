
export default function(state = {authenticated: false, token: ''}, actions){
    switch (actions.type) {
        case 'LOG_USER':
            // console.log(actions.payload)
            state.authenticated = actions.payload
            console.log(state.authenticated)

            return state
        case 'TOKEN':
            state.token = actions.payload
            return state
            
        default:
            return state;
    }
    
}