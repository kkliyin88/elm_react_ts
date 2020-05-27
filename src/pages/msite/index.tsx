//about.js
import * as React from 'react';
import './index.css';
export default class Msite extends React.Component {
  constructor(props:Object) {
    super(props);
    console.log('props_msite',props);
    
    this.state = {
      geohash: '', // city页面传递过来的地址geohash
      msiteTitle: '请选择地址...', // msite页面头部标题
      foodTypes: [], // 食品分类列表
      hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
      imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
    }
  } 
  componentDidMount() {
    
  } 
  render() {
    return (<h1>
      欢迎，这里是msite
    </h1>)
  }
}