//about.js
import * as React from 'react';
import './index.css';
import ShopList from '../../components/shopList/index.jsx';
import store from '../../redux/store';
import Header from '../../components/header/index.jsx';
export default class Msite extends React.Component {
  constructor(props:Object) {
    super(props);
    this.state = {
      geohash: '', // city页面传递过来的地址geohash
      msiteTitle: '请选择地址...', // msite页面头部标题
      foodTypes: [], // 食品分类列表
      hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
      imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
    }
  } 
  componentDidMount() {
    console.log('ddddd',store.getState().place.name);
    
  } 
  render() {
    return (
      <section>
        <section >
          <Header goback>
            {store.getState().place.name}
          </Header>
        </section>
        <section style={{paddingTop:'50px'}}>
          <ShopList></ShopList>
        </section>
      </section>
    )
  }
}