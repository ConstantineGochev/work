export default function (state = { selected_ball: null, sphere_balls: [] }, actions) {
    switch (actions.type) {
        case 'SELECT_BALL':
            // console.log(actions.payload)
            state.selected_ball = actions.payload
            return state


        default:
            return state;
    }

}