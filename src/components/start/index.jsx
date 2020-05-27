//about.js
import React from 'react';
import { Rate } from 'antd';
// import './index.css';
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    
    return (
      <div className="rating_container">
        <section className="star_container">
          <Rate disabled defaultValue={this.props.startNum} />
        </section>
     </div>
     )
  }
}