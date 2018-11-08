import React from 'react'
import axios from 'axios'
import { Table, Rail, Segment, Button  } from 'semantic-ui-react'
import { Link } from 'react-router'


class LogDetails extends React.Component {
    constructor(props) {
        super()
        this.state = {
            log: {}
        }
    }
    componentWillMount() {
        this.fetch_log()
    }
    fetch_log() {
      axios.get('https://'+ window.location.hostname + `:8158/new_path/apiv2/entry/logs/${this.props.params.id}`)
      .then(res => {this.setState({log: res.data.log})}).catch(err => console.log(err));
    }

    render () {
        return (
            <div style={{margin:'2em'}}>

                <Link to="/player_logs" ><Button basic icon='arrow alternate circle left outline' content='Back' style={{marginTop:'3em'}} /></Link>


                <Table celled selectable>
    <Table.Header>
      <Table.Row className="center aligned">
        <Table.HeaderCell  className="center aligned">Previous values</Table.HeaderCell>
      
        <Table.HeaderCell >New values</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
    <Table.Row>
        <Table.Cell positive> name: <span style={{fontSize:'2em'}}>{this.state.log.prev_player_name}</span></Table.Cell>
        <Table.Cell textAlign='right' negative>name:<span style={{fontSize:'2em'}}>{this.state.log.player_name}</span></Table.Cell>
     
      </Table.Row>
      <Table.Row>
        <Table.Cell positive>password:<span style={{fontSize:'2em'}}>{this.state.log.prev_player_pass}</span></Table.Cell>
        <Table.Cell textAlign='right' negative>password:<span style={{fontSize:'2em'}}>{this.state.log.player_pass}</span></Table.Cell>
      
      
      </Table.Row>
  
      <Table.Row>
        <Table.Cell positive>balance:<span style={{fontSize:'2em'}}> {this.state.log.prev_player_balance}</span></Table.Cell>
        <Table.Cell textAlign='right' negative>balance:<span style={{fontSize:'2em'}}>{this.state.log.player_balance}</span></Table.Cell>
      </Table.Row>
      <Table.Row >
        <Table.Cell positive>player ID: <span style={{fontSize:'2em'}}>{this.state.log.prev_player_id}</span></Table.Cell>
        <Table.Cell textAlign='right' negative>player ID:<span style={{fontSize:'2em'}}>{this.state.log.player_id}</span></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell positive>status:<span style={{fontSize:'2em'}}>{this.state.log.prev_status}</span></Table.Cell>
        <Table.Cell textAlign='right' negative>status:<span style={{fontSize:'2em'}}>{this.state.log.status}</span></Table.Cell>
      </Table.Row>
    
    </Table.Body>
  </Table>          
            </div>
        )
    }
}


export default LogDetails