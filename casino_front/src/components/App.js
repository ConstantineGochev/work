import React, { Component } from 'react';
import Navigation from './Navigation'
import Header from './Header'
import Footer from './Footer'
import Gametabs from './Gametabs'
import Flag from '../styles/images/z_portal_flag_en.png';


class App extends Component {
  constructor() {
    super();
    this.state = {
      aspectRatio: null,
      flag: null,
      width:  null,
      height: null,
      elementsSize: 0.1 // 10% of width
    }
  }
  updateDimensions() {
    let ratio = window.innerWidth / window.innerHeight
    let width = Math.ceil(window.innerWidth)
    let height = Math.ceil((width/16)*9)
    if(window.innerHeight <= height){
      width = window.innerHeight*1.8 // result of 16/9 rounded
    }
    if(ratio >= 1.8){
      height = window.innerHeight
    }

      this.setState({
        aspectRatio:ratio,
        width:width,
        height:height
      })

      document.getElementsByClassName('slick-track')[0].style.height = height*0.57 + 'px'
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }


  render() {
    return (
       
        <div id="main"style={{width:this.state.width, height:this.state.height, marginTop: (window.innerHeight - this.state.height) / 2}}>
            <Header />
            {/* <Gametabs height={this.state.height} width={this.state.width} /> */}
            <Navigation height={this.state.height} width={this.state.width}/>
            <Footer height={this.state.height} width={this.state.width}/>
            <div className='flag-wrap' style={{width: this.state.width*0.1}}><img className='flag' src={Flag}/></div>
        </div>  
    );
  }
}

export default App;
