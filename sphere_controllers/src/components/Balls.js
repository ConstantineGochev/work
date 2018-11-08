import React, { Component} from 'react';
import Ball from './Ball';
import {Segment } from 'semantic-ui-react';
import {select_ball} from '../actions/index'
import {connect } from 'react-redux'


function importAll(r) {
    return r.keys().map(r);
  }

const images = importAll(require.context('../imgs', false, /\.(png|jpe?g|svg)$/));

class Balls extends Component {
    constructor(props) {
        super()
        this.state = {
            selected_ball: '',
            balls: props.drawn_balls
        }
    }
    render_balls() {
       // console.log(images)
    //   console.log(this.state.balls)
       
      return images.map((img, i) => {
        
          return <Ball index={i} key={i} img={img} balls={this.state.balls} />
      })

    }
  componentWillReceiveProps(nextProps){
    this.setState({balls: nextProps.drawn_balls})
  }
    // componentWillUnmount () {
    //     this.on_ball_click = null
    // }

    render () {
       // console.log(this.state.selected_ball)
        return (
            
            <div style={{marginTop: '2%', marginBottom: '2%'}} className='balls-content'>
                <Segment >
                    
                    {this.render_balls()}
                    
                </Segment>
            </div>
           
        )
    }
}



export default connect(null, {select_ball})(Balls)