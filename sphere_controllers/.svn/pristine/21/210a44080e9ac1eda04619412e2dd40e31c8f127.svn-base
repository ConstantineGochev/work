import React, { Component } from 'react'
import { connect } from 'react-redux'
import { select_ball } from '../actions'


class Ball extends Component {
    constructor(props) {
        super(props)
        this.state = {
           balls: props.balls
        }
        this.ball = React.createRef()
    }
    on_ball_click = () => {
       // console.log(this.ball)
        const selected_ball = Number(this.ball.current.attributes.index.value) + 1
      //  console.log(select_ball)
        this.props.select_ball(selected_ball)

    }
  componentWillReceiveProps(nextProps){
    this.setState({balls: nextProps.balls})
  }
   check_balls = () => {
       if(this.ball.current === null || this.state.balls === null) return 
        // console.log(this.state.balls)
       var self = this
        function check_ball(element) {
            return element === Number(self.ball.current.attributes.index.value) +1
        }
        return this.state.balls.some(check_ball)
      // console.log(Number(this.ball.current.attributes.index.value) +1)
   }


    render() {
         //console.log(this.state.balls)
       //  console.log(this.ball)
        var self = this
        return (
            <div onClick={this.on_ball_click} ref={this.ball} index={this.props.index} style={this.check_balls()?{visibility:'hidden', opacity:'0', transition: 'visibility 0s 1s, opacity 1s linear'}:{visibility:'visible', opacity:'1', transition: ' opacity 1s linear' }} >
                <img style={{ height: '70px', width: '70px', margin: 'auto', justifyContent: 'center', display: 'flex', cursor:'pointer' }} src={this.props.img} />
            </div>
        )
    }
}

export default connect(null, { select_ball })(Ball)