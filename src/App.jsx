import  React from 'react';
import './style/common.scss' // 公共的css
import 'antd/dist/antd.css';
import { HashRouter, Route } from 'react-router-dom'
// import svgIcon from './components/common/svg';

// import About from './pages/about';
// import Home from './pages/home/index.jsx';
// import City from './pages/city/index.jsx';
// import Msite from './pages/msite/index.jsx';
import Shop from './pages/shop/index.jsx';

export default class App extends React.Component{
  render(){
    return (
      <div className="App">
         <HashRouter>
          <div>
          {/* <Route exact path="/about" component={About}></Route> */}
            <Route exact path="/" component={Shop}></Route>
            {/* <Route exact path="/city" component={City}></Route>
            <Route exact path="/msite" component={Msite}></Route>
            <Route exact path="/shop" component={Shop}></Route> */}
          </div>
        </HashRouter>
      </div>
    );
  }
 
}

