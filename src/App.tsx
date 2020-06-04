import * as React from 'react';
import './style/common.scss' // 公共的css
import 'antd/dist/antd.css';
import { HashRouter, Route } from 'react-router-dom'
// import svgIcon from './components/common/svg';

import store from './redux/store'
import Home from './pages/home/index';
import City from './pages/city/index';
import Msite from './pages/msite/index';
import Shop from './pages/shop/index';

export default class App extends React.Component <any, any>{
  render(){
    return (
      <div className="App">
         <HashRouter>
          <div>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/city" component={City}></Route>
            <Route exact path="/msite" component={Msite}></Route>
            <Route exact path="/shop" component={Shop}></Route>
          </div>
        </HashRouter>
      </div>
    );
  }
 
}

