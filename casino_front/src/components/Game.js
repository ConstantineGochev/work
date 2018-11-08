import React, {Component} from 'react';
import {connect} from 'react-redux'
import axios from 'axios';
import Pointable from 'react-pointable';
import link1 from '../styles/images/keno_535.png';
import link2 from '../styles/images/keno_642.png';

// var strWindowFeatures = "location=yes,width=1045,height=613,scrollbars=no,status=no,resizable=no,menubar=no,location=no,toolbar=no,titlebar=no";
class Game extends Component {
    constructor(props) {
        super()
          this.state = {
              'clicked':false,
              src:'',
              display:'none'
        }
    }


  animate_down = () =>{
         this.setState({
           'clicked': true
         });
      }
      animate_up = () =>{
         this.setState({
           'clicked': false
         });
      }

 is_active = () => {
        return this.state.clicked ? ' active': ' inactive'
    }

     open_game = async () => {
         const {player_id,screenname} = this.props.player
         console.log("GAME PROPS", this.props)
         const {game} = this.props
         const {game_id} = game
         const operator = game.operator[0]
         console.log(game.operator)
         const newWindow = await window.open()
         const {portal_code, ip_adress} = operator
         const post_obj = {player_id, portal_code}
         const res = await axios.post(`https://` + window.location.hostname +':8158/new_path/apiv2/entry/', post_obj)
         const {defence_code} = res.data
         // port from 8154 to 8153 + "/portal/" instead of "L"
         let url = `https://${ip_adress}:8153/portal/?playerId=${player_id}&portalCode=${portal_code}&defenceCode=${defence_code}&language=EN&screenName=${screenname}&country=BG&gameid=${game_id}&theme=green535`
         console.log(`https://${ip_adress}:8153/portal/?playerId=${player_id}&portalCode=${portal_code}&defenceCode=${defence_code}&language=EN&screenName=${screenname}&country=BG&gameid=${game_id}&theme=green535`)

         const fill = newWindow.location.href = `https://${ip_adress}:8153/portal/?playerId=${player_id}&portalCode=${portal_code}&defenceCode=${defence_code}&language=EN&screenName=${screenname}&country=BG&gameid=${game_id}&theme=green535`
        //  window.open(url)
     }


    render() {
        return (

              // <Pointable onPointerUp={this.open_game} className="THIS">
                <div>
                     {/* <Iframe src={this.state.src} display={this.state.display}  />                    */}
                    <img style={{cursor:"pointer"}}  onClick={this.open_game} className={'image' + this.is_active()}  src={this.props.image} alt="2" />
                </div>
            //  </Pointable> 
        )
    }
}



export default Game
