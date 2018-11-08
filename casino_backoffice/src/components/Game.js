import React, {Component} from 'react'
import { Button, Card, Image, Container,Grid,  Segment, Header, Modal, Form,Radio,Dropdown,Message } from 'semantic-ui-react'
import moment from 'moment'


const Game = (props) => {
  if(props.operator === undefined) return null
    return (
        <Grid.Column key={props.game._id}>
            <Card.Group>
                <Card>
                    <Card.Content>
                        {/* <Image floated='right' size='mini' src='/images/avatar/large/molly.png' /> */}
                        <Card.Header>{props.game.game_name}</Card.Header>
                        <Card.Meta>game type: {props.game.game_type}</Card.Meta>
                        <Card.Meta>game id: {props.game.game_id}</Card.Meta>
                        <Card.Description>
                            {/* Operator : {JSON.stringify(game.operator)} */}
                            <strong>Operator:</strong>
                            <div><span>Operator Name: </span>  {props.operator.operator_name}</div>
                            <div><span>IP adress:</span>  {props.operator.ip_adress}</div>
                            <div><span>Name:</span>{props.operator.name}</div>
                            <div><span>Pass:</span>{props.operator.pass}</div>
                            <div><span>Portal code:</span>{props.operator.portal_code}</div>
                            <div><span>Created:</span>{moment(props.operator.created).format("MMM Do YY")}</div>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic color='green' onClick={() => props.show_update_modal(props.game)}>
                                Update
                                    </Button>
                            <Button basic color='red' onClick={() => props.show(props.game)}>
                                Destroy
                                   </Button>
                        </div>
                    </Card.Content>
                </Card>
            </Card.Group>
        </Grid.Column>
    )
}


export default Game
