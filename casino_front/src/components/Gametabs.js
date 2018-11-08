import React, {Component} from 'react';

class Gametabs extends Component {
    constructor(props){
    super(props)
      this.state = {
        // activeIndex: 0,
        // data: ['ALL GAMES', 'KENO', 'BINGO']
      }
    }


    // setSelect = (index) => {
    //     this.setState({
    //       activeIndex: index
    //     })
    //   }

    render(){
        return(
            <div className="btnTabs" 
                style={{
                    lineHeight: this.props.height*0.03 + 'px',
                    fontSize: this.props.height*0.022
                }}>
                <ul>
                {
                    this.props.data.map((d, index) => 
                    <li className={index === this.props.activeIndex ? 'activeTabs': 'not-active'} onClick={(e) => this.props.setSelect(index)} value={d} key={d}>{d}</li>
                    )
                }
                </ul>
            </div>
        )
    }
}

export default Gametabs