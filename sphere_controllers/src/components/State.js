import React from 'react'
import {connect } from 'react-redux'
import axios from 'axios'
import { Icon, Table, Step, Segment, Label,Form,Radio, Button, Container, Message } from 'semantic-ui-react'
import URL from '../config';
import {Animated} from "react-animated-css";
import {select_ball} from '../actions'


class StateTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected_state: 0,
      states: [0,1,2,3],
      isVisible:true
    }
    this.state_0 = React.createRef()
    this.state_1 = React.createRef()
    this.state_2 = React.createRef()
    this.state_3 = React.createRef()
  
  }
  togglePlay = () => {
    this.setState({ play: !this.state.play });
    console.log(this.audio);
    this.state.play ? this.audio.play() : this.audio.pause();
  }
  componentDidMount() {
    this.forceUpdate()
  }

  determine_state (s) {
  //console.log(this.state_0)
   if(s.current === null ) return 
   if(s.current.props.index === this.props.current_state) {
     return true
   }
    return false    
  }
  handleChange = (e, { value }) => this.setState({ selected_state: value })
  change_state  = () => {
    let post_options = {
      method: 'POST',
      url: 'https://' +URL +':8160/control',
      headers: { 'token': this.props.auth.token },
      data: {
        "state": this.state.selected_state,
        "ball": 90,
        "change": {},
        "stop": false
      }
    }

    //const self = this
    axios(post_options).then((res) => {
      console.log(res)
      // self.setState({
      //     response: res
      // })

    }).catch(err => console.log(err))
  }
      skip_ball = async (ball_number) => {
        console.log(ball_number)
        var data_obj = {}
        // console.log(JSON.parse(this.props.drawnBalls.balls))
        // JSON.parse(this.props.drawnBalls.balls)
        console.log(negative_number)
        var negative_number;
        for(let number of JSON.parse(this.props.drawnBalls.balls)) {
          if(number < 0) {
            negative_number = number
          }
        }
        console.log(negative_number)
     if( negative_number === undefined) return
       data_obj[ball_number.toString()] = negative_number.toString()

        console.log(data_obj)
        let post_options = {
            method: 'POST',
            url: 'https://' + URL + ':8160/control',
            headers: { 'token': this.props.auth.token },
            data: {
                "ball": 90,
                "state": 2,
                "change": data_obj,
                "stop": false
            }
        }
      //  console.log(post_options)

        //const self = this
       const response = await axios(post_options)
       await this.props.select_ball(null)
    }
    renderMsg = () => {
      let drawnBals = this.props.drawnBalls.balls.toString().replace(/[\[\]/]/gi, "") 
      let checkB = drawnBals.indexOf('-') > -1
      if(checkB){   
        return <Animated animationIn="bounceIn" animationOut="bounce" isVisible={this.state.isVisible}><Message
        icon="warning"
        error
        header='Error'
        list={[
          'Wrong ball drawn',
        ]}
      /></Animated>
      }else{
        return null
      }
    }

    currBall = () => {
      // let color = "black";
      // let currBalltoArr = JSON.parse(this.props.drawnBalls.balls) // get the data as an Array
      // let drawnBall = currBalltoArr[currBalltoArr.length -1] // getting the last element of the Array

      // if(drawnBall !== undefined){ 
      //   let stringBall = drawnBall.toString() // NEEDED to use indexOf
      //   if(stringBall.indexOf('-') > -1 === true){ // search for "-" in the balls
      //     color = "red"
      //   }
      // }
      // return <span style={{color:`${color}`}}>{drawnBall}</span>
     // console.log(this.props.drawnBalls.balls)
      return JSON.parse(this.props.drawnBalls.balls).length
    }

  render() {
    const drawnBals = this.props.drawnBalls.balls.toString().replace(/[\[\]/]/gi, "").replace(/[,]/g, ", ") // removing "[]" from array and adding space after coma
  //  console.log(this.props.balls.selected_ball)
  ///console.log(this.props.drawnBalls)
    var parsed_balls = JSON.parse(this.props.drawnBalls.balls)
   // console.log(parsed_balls)
    //var sphere_balls_arr = JSON.parse(parsed_state.balls)
    return (
      <div style={{width: '58%'}}>
        <Segment>
          {this.renderMsg()}
        
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='3'>Game Statistics</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing>
                  <Icon name='game' /> GAME
        </Table.Cell>

                <Table.Cell collapsing textAlign='right'>
                  {this.props.game_id}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Icon name='time' /> START
        </Table.Cell>

                <Table.Cell textAlign='right'>12:45</Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>
                  <Icon name='baseball ball' /> BALL
          </Table.Cell>

                <Table.Cell textAlign='right'>#<span style={{fontWeight:'bold'}}>{this.currBall()}</span></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell >
                  <Button primary onClick={this.change_state} ><Icon name='settings' />CHANGE STATE </Button>
                </Table.Cell>
                <Table.Cell>
                  <Form>
                    <Form.Field>
                      Selected state: <b>{this.state.selected_state}</b>
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='IDLE'
                        name='radioGroup'
                        value={0}
                        checked={this.state.selected_state === 0}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='BET PLEASE'
                        name='radioGroup'
                        value={1}
                        checked={this.state.selected_state === 1}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='NMB'
                        name='radioGroup'
                        value={2}
                        checked={this.state.selected_state === 2}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='END GAME'
                        name='radioGroup'
                        value={3}
                        checked={this.state.selected_state === 3}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </Form>
                </Table.Cell>

              </Table.Row>

            </Table.Body>
          </Table>
        </Segment>
        <Label> DRAWN BALLS</Label>
        
        <Button positive onClick={() => this.skip_ball(parsed_balls.length)}>Skip Ball </Button>
        <Segment style={{minHeight:50,maxWidth:99 + "%", overflowWrap: "break-word",  overflow: "hidden"}}>{drawnBals}</Segment>
        <Label> GAME STATES </Label>
        
        <Segment >
          <Step.Group fluid  widths={4}>
            <Step active={this.determine_state(this.state_0)} index={this.state.states[0]} ref={this.state_0}>
              <Icon name='hourglass outline' />
              <Step.Content>
                <Step.Title>IDLE</Step.Title>
                <Step.Description>Starting state of the game</Step.Description>
              </Step.Content>
            </Step>
            <Step active={this.determine_state(this.state_1)} index={this.state.states[1]} ref={this.state_1}>
              <Icon name='hourglass start' />
              <Step.Content>
                <Step.Title>BETPLEASE</Step.Title>
                <Step.Description>Betting phase of the game </Step.Description>
              </Step.Content>
            </Step>
            <Step active={this.determine_state(this.state_2)} index={this.state.states[2]} ref={this.state_2}>
              <Icon name='hourglass half' />
              <Step.Content>
                <Step.Title>NMB</Step.Title>
                <Step.Description>Can`t place bets, the balls being drawn</Step.Description>
              </Step.Content>
            </Step>
            <Step active={this.determine_state(this.state_3)} index={this.state.states[3]} ref={this.state_3}>
              <Icon name='hourglass end' />
              <Step.Content>
                <Step.Title>ENDGAME</Step.Title>
                <Step.Description>End of the game </Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </Segment>

      </div>

    )
  }
}
function map_state_to_props (state) {
  return {
    auth: state.auth,
    balls: state.balls
  }
}

export default connect(map_state_to_props,{select_ball})(StateTable)