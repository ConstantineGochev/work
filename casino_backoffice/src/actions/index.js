import axios from 'axios';
import { PLAYERS, PLAYER_LOGS, REQUESTS, PLAYER, OPERATORS, GAMES, SORT_PARAMS, EDIT_PLAYER, FILTER_PARAMS, OPERATOR,AUTH_USER,AUTH_ERROR, CHAT} from './types';
import {reset} from 'redux-form'
import moment from 'moment'

global.axios = axios



export const reset_form = () => dispatch => {
    dispatch(reset('add_form'));
}

export const fetch_players = () => async dispatch => {

    const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/players/');
   // console.log(res)

    dispatch({
        type: PLAYERS,
        payload: res
    })
}
export const fetch_player = (id) => async dispatch => {
   const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/players/' + id)

   dispatch({
       type: PLAYER,
       payload: res
   })
}

export const fetch_player_logs = () => async dispatch => {

    const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/logs/');
   // console.log(res)

    dispatch({
        type: PLAYER_LOGS,
        payload: res
    })
}

export const fetch_requests = (page_num, size,sorttype,sortdirection, {created, err_code, msg, op, user, session_id, transfer_id}) => async dispatch => {
    //   console.log('created actions created', created)
    // console.log('index', moment(created).format())
       var res = await axios.get('https://' + window.location.hostname + `:8158/new_path/apiv2/entry/requests/${sorttype}/${sortdirection}/${page_num}/${size}/?created=${created}&err_code=${err_code}&msg=${msg}&op=${op}&user=${user}&session_id=${session_id}&transfer_id=${transfer_id}`);
    // console.log(res)
   // console.log(res)

    dispatch({
        type: REQUESTS,
        payload: res
    })
}

export const fetch_operators = () => async dispatch => {
  const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/operators/');

  dispatch({
      type: OPERATORS,
      payload: res
    })
}

export const fetch_operator = (id) => async dispatch => {
    const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/operators/'+ id);
    // console.log(res)
    dispatch({
        type: OPERATOR,
        payload: res
      })
  }
export const fetch_games = () => async dispatch => {
    const res = await axios.get('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/games/')
  // debugger;
    dispatch({
        type: GAMES,
        payload: res
    })

}

export const sort_params = (column, order) => dispatch => {
    var obj = {
        column,
        order
    }
    dispatch({
        type: SORT_PARAMS,
        payload: obj
    })
}

export const filter_params = (filter_obj) => dispatch => {
    dispatch({
        type: FILTER_PARAMS,
        payload: filter_obj
    })
}

export const signIn_user = (userProps) => async dispatch => {
    try {
        const response = await axios.post('https://' + window.location.hostname + ':8158/signin', userProps)
        //console.log(response.data)
        dispatch({
            type: AUTH_USER,
            payload: response.data
        })
        await localStorage.setItem('token', response.data.token)
        await localStorage.setItem('user_name', response.data.user_name)
    } catch (e) {
        dispatch({
            type: AUTH_ERROR,
            payload: 'Invalid login credentials.'
        })
    }
}

export const signUp_user = (userProps) => async dispatch => {
    try {

        const response = await axios.post('https://' + window.location.hostname + ':8158/signup', userProps)
        console.log(response.data)
        dispatch({
            type: AUTH_USER,
            payload: response.data
        })
        await localStorage.setItem('token', response.data.token)
    } catch (e) {
        dispatch({
            type: AUTH_ERROR,
            payload: 'Username is in use.'
        })
    }

}

export const signOut_user = () => {
    localStorage.removeItem('token')

    return {
        type: AUTH_USER,
        payload: ''
    }
}
export const get_msgs = (msgs) => {
     
    return {
        type: CHAT,
        payload: msgs
    }
}
