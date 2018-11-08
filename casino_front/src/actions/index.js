import axios from 'axios';
import {FETCH_USER, GAME_ID} from './types';

export const get_user = (name, password) => async  dispatch => {
       const res = await axios.get(`https://` + window.location.hostname + `:8158/new_path/apiv2/entry/current?screenname=${name}&password=${password}`)
           await dispatch({
             type: FETCH_USER,
             payload: res
            })
}


export const get_games = () => async dispatch => {

  const res = await axios.get(`https://` + window.location.hostname + `:8158/new_path/apiv2/entry/games/`)
  // console.log('INDEX', res.data.games)
  // Object.keys(res.data.games).map(function(key){
  //   console.log('KEYS', res.data.games[key].game_name)
  // })

  await dispatch({
    type: GAME_ID,
    payload: res.data
  })
}
