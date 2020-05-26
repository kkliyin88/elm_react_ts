import * as React from 'react';
import './style/common.scss' // 公共的css
import 'antd/dist/antd.css';
import { HashRouter, Route } from 'react-router-dom'
import About from './pages/about';
import Home from './pages/home/index.jsx';
import City from './pages/city/index.jsx';
export default class App extends React.Component <any, any>{
  render(){
    return (
      <div className="App">
         <HashRouter>
          <div>
          <Route exact path="/about" component={About}></Route>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/city" component={City}></Route>
          </div>
        </HashRouter>
      </div>
    );
  }
 
}

