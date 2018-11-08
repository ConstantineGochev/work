import React, { Component } from 'react'
// import { Route, Link } from 'react-router'
import Players from './Players'
// import SettingsForm from './SettingsForm'


class PlayersRoute extends Component {
    constructor(props) {
        super()
    }
    render() {
        console.log(this.props)
        return (
            <div>
                {/* <Link to='/settings_form' className="btn add" /> */}
                 <Players/> 
                {/* <Route path = {this.props.location.pathname} component = {Players} />
                <Route path={`${this.props.location.pathname}/settings_form`} component ={SettingsForm} /> */}
            </div>
        )

    }
}

export default PlayersRoute