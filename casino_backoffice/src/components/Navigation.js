import React, {Component} from 'react';
import {slide as Menu} from 'react-burger-menu';
import { Link } from 'react-router';
import navLinksConfig from '../navLinksConfig'
import { Icon } from 'semantic-ui-react'

export default class Navigation extends Component {
    constructor(props){
        super()
        this.state = {
            menuOpen: false
        }
    }
    handleStateChange = (state) => {
        this.setState({
            menuOpen: state.isOpen
        })  
      }
      closeMenu () {
        this.setState({
            menuOpen: false
        })
      }
      toggleMenu = () => {
        this.setState({
            menuOpen: !this.state.menuOpen
        })
      }

    render(){
        return (
            <Menu isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>
                <h1 className="header">CASINO<span className="version">v 1.3</span></h1>
                <div className="LinksBurger">
                    {navLinksConfig.map((links) => {
                    return <Link key={links.name} to={links.to} onClick={() => this.closeMenu()}><Icon name={links.icon}/>{links.name}</Link>
                })}
                </div>
                
            </Menu>
        )
    }
}