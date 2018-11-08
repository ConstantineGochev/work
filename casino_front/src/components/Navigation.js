import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import Button from './Button'
import Swiper from 'react-id-swiper';
import axios from 'axios';
import {connect} from 'react-redux'
import MyModal from './Modal';
import Game from './Game'
import Pointable from 'react-pointable';
import Slider from 'react-slick';
import Gametabs from './Gametabs'
import {get_games} from '../actions/index'
import 'semantic-ui-css/semantic.min.css';
import Footer from './Footer'
import { NavLink } from 'react-router-dom';
// import SelectMenu from './SelectMenu'
// import ReactSwipe from 'react-swipe';
// import querystring from 'querystring';
import link1 from '../styles/images/keno_535.png';
import link2 from '../styles/images/keno_642.png';
import link3 from '../styles/images/keno_wm642.png';
import link4 from '../styles/images/keno_lg649.png';
import link5 from '../styles/images/greeno_535.png';
import link6 from '../styles/images/keno_5135.png';
import link7 from '../styles/images/bingo_90.png';
import selectGame from '../styles/images/txt_select_game_en.png';
import { Carousel } from "react-responsive-carousel";
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// import Background from '../styles/images/e_portal_Zornica_mg.png';


function NextArrow(props) {
  const { className, style, onClick, name } = props;
  return (
    <div
      className="waves-effect next_btn"
      onClick={onClick}>{name}</div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick,name } = props;
  return (
    <div
      className="waves-effect prev_btn"
      onClick={onClick}>{name}</div>
  );
}


class Navigation extends Component {
      constructor(props){
        super(props)
        //this.g_id =
        this.state = {
              games:[],
              'clicked':false ,
              activeIndex: 0,
              data: ['ALL GAMES', 'Keno', 'Bingo']
        }
      }


    componentWillMount(){
       this.set_games()
      //  console.log('PROPS', this.props)
    }


      set_games = async () => {
       await this.props.get_games()
       await this.setState({
         games: this.props.games
        })
      }

      setSelect = (index) => {
        this.setState({
          activeIndex: index
        })
      }


      render() {
        const { activeIndex } = this.state 

        // console.log('props from app', this.props.height)
        // var balance;
        // if(this.props.login.user === undefined) {
        //   balance = 0;
        // }else {
        //   balance = this.props.login.user.balance
        // }
        //console.log(this.props.games)


        const settings = {
          className: "center",
          centerMode: true,
          dots: true,
          infinite: false,
          centerPadding: "0",
          slidesToShow: 1,
          speed: 500,
          rows: 2,
          slidesPerRow: 3,
    //       responsive: [
    //    {
    //      breakpoint: this.props.width,
    //      settings: {
    //         slidesPerRow: 3
    //      }
    //     }

    //  ],
          appendDots: dots => (
            <div>
              {/* <img src={selectGame}/> */}
            <div id="dots">
              <ul> {dots} </ul>
            </div>
           </div> 
          ),
          customPaging: i => (
            <div
              className="paging"
              style={{
                fontSize: this.props.width*0.012
                // bottom: this.props.height*0.6 + 'px'
                // border: "1px blue solid"
              }}
            >
              {i + 1}
            </div>
          ),
          nextArrow: <NextArrow name="" />,
          prevArrow: <PrevArrow name="" />
        };

       const FilteredGames = this.state.games.filter(res => {
          if(this.state.data[activeIndex] === "ALL GAMES"){
            return res
          }else{
            return res.game_name.indexOf(this.state.data[activeIndex]) > -1
          }
        })
        var pic;
       const RENDER_GAMES = FilteredGames.map((game) => {
          if (game.game_type === '5/35') {
            pic = link1
          }
          if (game.game_type === '6/42') {
            pic = link2
          }
          if(game.game_type === '5+1'){
            pic = link6
          }
          if(game.game_type === 'bingo'){
            pic = link7
          }

          return (
            <div key={game._id}>
              <Game player={this.props.login.user} game={game} image={pic}/>
              <div className="gameNameWrapper">
                <div className='gameName' style={{lineHeight: this.props.height*0.05 + 'px', fontSize: this.props.height*0.025}}> {game.game_name}</div>
              </div>
            </div>
          )
       })

        // const RENDER_GAMES =  this.state.games.map((game) => {
        //   // console.log(game.game_name.indexOf(this.state.data[activeIndex]) > -1)
        //   // if(game.operator !== []){
        //     if (game.game_type === '5/35') {
        //       pic = link1
        //     }
        //     if (game.game_type === '6/42') {
        //       pic = link2
        //     }
        //     // console.log(pic)
        //     return (
        //       <div key={game._id}>
        //         <Game player={this.props.login.user} game={game} image={pic}/>
        //         <div className="gameNameWrapper">
        //           <div className='gameName' style={{lineHeight: this.props.height*0.05 + 'px', fontSize: this.props.height*0.025}}> {game.game_name}</div>
        //         </div>
        //       </div>
        //     )
        //   // }
        //   })
        return (
        <div className='content'>
          <Gametabs height={this.props.height} width={this.props.width} activeIndex={this.state.activeIndex} data={this.state.data} setSelect={this.setSelect}/>
          <MyModal />
         <div className="sliderWrapper" style={{height: this.props.height*0.6}}>
         {/* <img className="selectGameImg" src={selectGame}/> */}
          <Slider {...settings}>
           {RENDER_GAMES}

            {/* <div onClick={alert('asd')} style={{'width': '20%'}}><img className="image" src={link3} onClick={this.location} alt="1"/></div>
            <div><img className="image" src={link2} alt="1"/></div>
            <div><img className="image" src={link4} alt="1"/></div>
            <div><img className="image" src={link5} alt="1"/></div>
            <div><img className="image" src={link2} alt="1"/></div>
            <div><img className="image" src={link1} alt="1"/></div>
            <div><img className="image" src={link3} alt="1"/></div>
            <div><img className="image" src={link5} alt="1"/></div>
            <div><img className="image" src={link1} alt="1"/></div>
            <div><img className="image" src={link2} alt="1"/></div>
            <div><img className="image" src={link2} alt="1"/></div>
            <div><img className="image" src={link3} alt="1"/></div>
            <div><img className="image" src={link4} alt="1"/></div>
            <div><img className="image" src={link5} alt="1"/></div>  */}
           </Slider>
          </div>
           {/* <Footer user={balance}/> */}


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

// export default Navigation
    export default connect(map_state_to_props,/*mapDispatchToProps*/{get_games})(Navigation)
