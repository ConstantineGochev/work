import React, {Component} from 'react';
import {connect } from 'react-redux'
import {fetch_games, fetch_operators} from '../actions/index'
import { Button, Card, Image, Container,Grid,  Segment, Header, Modal, Form,Radio,Dropdown,Message } from 'semantic-ui-react'
import * as extra from '../extra.js'
import axios from 'axios'
import { withAlert } from "react-alert";
import moment from 'moment'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Game from './Game'
import requireAuth from './HOCS/requireAuth'


const SortableItem = SortableElement(({value}) => <div style={{marginBottom: '10px',cursor:'move'}}>{value}</div>);
const SortableList = SortableContainer(({items}) => {
  return (
    <Grid>
      {items.map((value, index) =>
          <SortableItem key={`item-${index}`} index={index} value={value} />
      )}
    </Grid>
  );
});


class Games extends Component {
    constructor(props){
        super()
        this.state = {
            games: [],
            operators: [],
            modal_delete: false,
            modal_update: false,
            selected_game: '',
            selected_operator: '',
            game_id: '',
            game_name: '',
            game_type: '',
            err:false,
        }

    }

    componentDidMount(){
        this.set_data()
    }
    set_data = async () => { 
        await this.props.fetch_games()
        await this.props.fetch_operators()
        const {games,operators} = await  this.props
       // console.log(games)
        // if(games.length === 0 || operators.length === 0 ) return
        await this.setState({
            games,
            operators
        })

    }
    // componentWillReceiveProps(nextProps) {
    //     // console.log(nextProps.games[1])
    //     // console.log(this.state.games)
        
    //     //this.set_data()        
    //     // if (nextProps.games != this.state.games) {
    //     //     //Perform some operation
    //     //     this.setState({ games: nextProps.games });
    //     //     //this.classMethod();
    //     // }
    // }
    //delete games
    handle_delete = async (game) => {
         // console.log(game)
        await axios.delete('https://'+ window.location.hostname + `:8158/new_path/apiv2/entry/games/${game._id}`)
        await this.set_data()
        await this.setState({modal_delete:false})
        await this.props.alert.success(`you have successfully destroyed a game`)
    

    }
    //update games
    handle_update = (selected_game) => {
        // console.log(selected_game)
        if(isNaN(this.state.game_id) || this.state.game_type === '' || this.state.selected_game === '' || this.state.game_name === ''){
            //console.log('game id must be a number')
            this.setState({err:true})
           
        }else {
            this.setState({
                err:false
            })
            const {operators} = this.state.operators
            const {game_id, game_type ,game_name } = this.state
           // console.log(operators)
            var operator_data = operators.find((op) => {
                return op.name === this.state.selected_operator
            })
          //  console.log(operator_data)
        //   console.log(this.state.selected_game._id)
          var new_game = {
              game_name,
              game_id,
              game_type,
              operator: operator_data
          }
            axios.put('https://'+ window.location.hostname + `:8158/new_path/apiv2/entry/games/${selected_game._id}` , new_game).then((res) => {
                // console.log(res)
                this.setState({modal_update: false,game_id:'',game_type: '',err:false,selected_game:'',selected_operator: ''})
                this.set_data()
                this.props.alert.success('You have successfuly updated a game.')

            })
           // console.log(new_game)

        }
        //   console.log(selected_game._id)
        //   console.log(this.state.game_id)
        //   console.log(this.state.game_type)
        //   console.log(this.state.selected_operator)



    }
    show = (selected_game) => this.setState({ modal_delete: true, selected_game })
    show_update_modal = (selected_game) => this.setState({ modal_update: true, selected_game })
    close_update_modal = () => this.setState({ modal_update: false,game_id:'',game_type: '',err:false })
    close = () => this.setState({ modal_delete: false })
    get_order =  (games) => {
        for(let i = 0; i< games.length; i++) {
            games[i].sort_number = i;
        }
    }
    componentDidUpdate () {
        this.get_order(this.state.games)
    }
    onSortEnd =  ({ oldIndex, newIndex,collection },e ) => {
        // console.log('movinggggggg')
        // console.log(this.state.games)
        // console.log('------COLLECTION-------')
        // console.log(collection)
        // console.log('------EVENT-------')        
        // console.log(e)

        // console.log(oldIndex)
        // console.log(newIndex)
        // debugger
    const {games} = this.state
    if(games === undefined) return 

        this.setState({
            games: arrayMove(this.state.games, oldIndex, newIndex)
        });
    };

    // render_game begining
    RENDER_GAMES(){
       // debugger;
      // var row_size = 3
        if (this.state.games === undefined) return
        var { games } = this.state
        // console.log(games)
        //console.log( delete games[0])
        //console.log(games[0])
        var rows = games.map((game, i) => {
            var operator = game.operator.map((op) => {
                //    console.log('opLOG', op)
                const { created, ip_adress, name, operator_name, pass, portal_code } = op
                return {
                    created,
                    ip_adress,
                    name,
                    operator_name,
                    pass,
                    portal_code
                }
            })

            //console.log(operator[0])
            //console.log(operator.ip_adress)
            // put small image in the game card ?
            console.log('Op ot 0', operator[0])
            return <Game game={game} operator={operator[0]} show_update_modal={this.show_update_modal} show={this.show} key={i} />

        })
        // console.log(rows)
        return rows
    }
    //render_games end
     handleChange = (e, { value }) => {
         //console.log(e)
        // console.log(value)
         this.setState({ 
             game_type: value })
     }
     changeValueHandler = (e) => {
          // console.log([e.target.name])
           this.setState({
               [e.target.name]: e.target.value
           })
     }
    op_change = (e ,data) =>{
      
        this.setState({
           selected_operator: data.value
        })
    }
    sort_games = () => {
        // console.log('clicckkk')
        // console.log(this.state.games)
        var sorted = this.state.games.map((game) => {
            return {game_id:game.game_id,
                    sort_number:game.sort_number}
        })

       // console.log(sorted)
        axios.put('https://'+ window.location.hostname + ':8158/new_path/apiv2/entry/games',{'sorted':sorted}).then(()=> {

        })
    
           // console.log(res)
           this.props.alert.success('You have successfuly sorted the games.')
        
    }
    render() {
        if(this.state.operators === undefined || this.state.operators.operators === undefined) return null
        const {operators} = this.state.operators
        const mapped_ops = operators.map((operator) => {
            const {created,ip_adress, name, operator_name, pass,portal_code, url,_id } = operator
            return {
                text: name,
                value: name,
                key: _id
            }
        })
    
       // console.log(this.state.games)
       
        return (
            <div>
            <Header as='h3' content='Manage Games' textAlign='center' style={style.h3} />

           <Button positive icon='shuffle' className="greenLeftBtn"content= 'Sort Games' onClick={this.sort_games}/>
           <SortableList items={this.RENDER_GAMES()} onSortEnd={ this.onSortEnd.bind(this)} transitionDuration={1000} axis='xy'  />
            {/* {this.RENDER_GAMES()}   */}
    
             <Modal size={'small'} open={this.state.modal_delete} onClose={this.close}>
                <Modal.Header>Delete This Game</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this game ?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}negative>No</Button>
                    <Button onClick={() => this.handle_delete(this.state.selected_game)} positive icon='checkmark' labelPosition='right' content='Yes' />
                </Modal.Actions>
            </Modal>


             <Modal size={'large'} open={this.state.modal_update} onClose={this.close_update_modal}>
                <Modal.Header>Update Game Settings</Modal.Header>
                <Modal.Content>
                    <Form error={this.state.err} autoComplete="off">
                         <Form.Field>
                            <label>Game Name:</label>
                            <input name="game_name" placeholder={this.state.selected_game.game_name} onChange={this.changeValueHandler}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Game ID:</label>
                            <input name="game_id" placeholder={this.state.selected_game.game_id} onChange={this.changeValueHandler}/>
                        </Form.Field>               
                        <Form.Group inline>                        
                            <label>Game Type:</label>
                            <Form.Field
                                control={Radio}
                                label='5/35'
                                value='5/35'
                                checked={this.state.game_type === '5/35'}
                                onChange={ this.handleChange}
                            />
                            <Form.Field
                                control={Radio}
                                label='6/42'
                                value='6/42'
                                checked={this.state.game_type === '6/42'}
                                onChange={ this.handleChange}
                            />
                              <Form.Field
                                control={Radio}
                                label='5+1'
                                value='5+1'
                                checked={this.state.game_type === '5+1'}
                                onChange={ this.handleChange}
                            />
                                 <Form.Field
                                control={Radio}
                                label='bingo'
                                value='bingo'
                                checked={this.state.game_type === 'bingo'}
                                onChange={ this.handleChange}
                            />
                          <Form.Field>
                               <Dropdown placeholder='Select Operator' onChange={this.op_change} search selection options={mapped_ops}  /> 
                          </Form.Field>
                          {
                              this.state.err &&
                          <Message
                              error
                              header='Action Forbidden'
                              content='Game ID must be a number and you must select a game type, operator and game name.'
                          />
                          }
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close_update_modal()}negative content="Go Back" />
                    <Button onClick={() => this.handle_update(this.state.selected_game)} positive icon='checkmark' labelPosition='right' content='Finish' />
                </Modal.Actions>
            </Modal>
            </div>
        )
    }
}

const style = {
  h1: {
    marginTop: '3em',
  },
  h2: {
    margin: '4em 0em 2em',
  },
  h3: {
    marginTop: '0em',
    padding: '5em 0em 1em',
  },
  last: {
    marginBottom: '300px',
  }
}

function map_state_to_props(state) {
    return {
        games: state.games,
        operators: state.operators
    }
}


export default connect(map_state_to_props, {fetch_games, fetch_operators})(withAlert(requireAuth(Games)))