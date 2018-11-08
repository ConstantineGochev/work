import React, {Component} from 'react';
import BackgroundDown from '../styles/images/e_portal_Zornica_down.png';
import Flag from '../styles/images/z_portal_flag_en.png';
import {connect} from 'react-redux'
import {get_games} from '../actions/index'
//import CountUp from 'react-countup';
import AnimatedNumber from 'react-animated-number';
import selectGame from '../styles/images/txt_select_game_en.png';
import {sprintf} from 'sprintf-js'
// function m(money, cc) {
//     return util.format("%s %s", Number((money | 0) / 100).toFixed(2), cc);
// }
function m2(money) { // without the CC
    return sprintf("%s", Number((money | 0) / 100).toFixed((2)));
}

class Footer extends Component {
 
  constructor(props){
    super(props)
    //this.g_id =
    this.state = {
          games:[]
          // 'clicked':false
    }
  }



  componentWillMount(){
    this.set_games()
 }
 set_games = async () => {
  await this.props.get_games()
  await this.setState({
    games: this.props.games
   })
 }
    render(){
      var balance;
      if(this.props.login.user === undefined) {
        balance = 0;
      }else {
        balance = this.props.login.user.balance
        
      }
   
  return (
    <div className='footer'>
       <img className="selectGameImg" src={selectGame}/>
      <div className="cashSign" style={{width:this.props.width*0.2}}></div>
      <div className='wrap-balance' style={{width:this.props.width*0.2, height:this.props.height*0.05, border:`${this.props.width*0.0011+"px"} solid grey`}}>
        <span className='currency' style={{fontSize: this.props.width*0.013,lineHeight:this.props.width*0.013 + 'px'}}>BGN</span>

      <div className='balance'> 
      <AnimatedNumber  value={balance}
            style={{
                transition: '0.8s ease-out',
                fontSize: this.props.width*0.020,
                lineHeight: 0,
                transitionProperty:
                'background-color, color, opacity'
            }}
        
            duration={1000}
            formatValue={number => m2(number)}/>
        </div> 

      </div>
      {/* <div className='flag-wrap'><img className='flag' src={Flag}/></div> */}
      <img src={BackgroundDown}/>

    </div>
  )
}
}
function map_state_to_props(state){
  return {
    login: state.login,
    games: state.games
   }
}
// export default Footer
export default connect(map_state_to_props,/*mapDispatchToProps*/{get_games})(Footer)
