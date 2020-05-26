
import React from 'react';
import './index.css';
 import { LeftOutlined,RightOutlined } from '@ant-design/icons';
import createHistory from 'history/createBrowserHistory'
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  goback(){
    let history =createHistory()
    history.goBack();
  }
  
  render() {
    console.log('props',this.props);
    
    return (
      <section>
         <header id='head_top'>
           {this.props.goback?<section className='head_goback'>
              <LeftOutlined   onClick={this.goback} style={{ fontSize: '16px', color: '#FFF' }} />
           </section>:''}
           
          <section className='title_head ellipsis'>
            <span className="title_text">{this.props.children}</span>
          </section>
          {/* <section>
            <RightOutlined />
          </section> */}
          
      </header>
      </section>
     
  )
  }
}