export const  log_user  = (bool) => dispatch => {
    dispatch ({
        type: 'LOG_USER',
        payload: bool
    })

    //setTimeout(callback, 100)
localStorage.setItem('authenticated', bool)
}

export const get_token = (token) => dispatch => {
    dispatch ({
        type: 'TOKEN',
        payload: token
    })
    localStorage.setItem('token', token)
}

export const select_ball = (ball_num) => dispatch => {
    dispatch({
        type: "SELECT_BALL",
        payload: ball_num
    })
}

