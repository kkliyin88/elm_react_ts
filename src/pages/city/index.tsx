//about.js
import * as React from "react";
import './index.css';
import { searchplace} from '../../service/index.js';
import {getStore, setStore, removeStore} from '../../config/mUtils'
import Header from '../../components/header/index.jsx';
// import createHistory from 'history/createBrowserHistory';
import store from '../../redux/store';
import {change_city,change_place} from '../../redux/action';

export default class City extends React.Component<any,any> {
  constructor(props:any) {
      super(props);
      this.state = {
        inputVaule:'', // 搜索地址
        cityid:'', // 当前城市id
        cityname:'', // 当前城市名字
        placelist:[], // 搜索城市列表
        placeHistory:[], // 历史搜索记录
        historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
        placeNone: false, // 搜索无结果，显示提示信息
      }
  }
  clearAll(){ //清除历史搜索记录
    removeStore('placeHistory');
    this.initData();
  }
  initData(){ //初始化所选择的城市，如果没有默认深圳 初始化搜索历史记录
      this.setState({
        cityid:store.getState().city.id,
        cityname:store.getState().city.name
      })
    //获取本地查询记录
    if (getStore('placeHistory')) {
      let placelist:any = getStore('placeHistory');
      placelist = JSON.parse(placelist);
      this.setState({
        placelist
      })
    }else{
      this.setState({
        placelist:[]
      })
    } 
  }
  inptChange(event:any){
    this.setState({
      inputVaule:event.target.value
    })
  }
  componentDidMount() {
    this.initData()
  }
  //发送搜索信息inputVaule
  postpois(){
      //输入值不为空时才发送信息
      if (this.state.inputVaule) {
          searchplace(this.state.cityid, this.state.inputVaule).then(res => {
            this.setState({
              historytitle:false,
              placelist:res,
              placeNone:res.length? false : true
            })
          })
      }
  }
  nextpage(index:any,item:any){
    let history = getStore('placeHistory');
    let choosePlace = this.state.placelist[index];
    let  placeHistory = []
    if (history) { //
        let checkrepeat = false;
        placeHistory = JSON.parse(history)
        placeHistory.forEach((itemm:any) => {
            if (itemm.geohash === item.geohash) {
                checkrepeat = true;
            }
        })
        if (!checkrepeat) {
          placeHistory.push(choosePlace)
        }
    }else {
        placeHistory.push(choosePlace)
    }
    setStore('placeHistory',placeHistory);
    let action = change_place(item) //存储当前的place信息 msiteye页面使用
    store.dispatch(action);
    this.props.history.push({pathname:'/msite', state:item.geohash});
  }
  render() {
    return (
		<div className="city_container">
          <Header goback>
            {this.state.cityname}
          </Header>
		      <section className="city_form">
            <div>
                <input type="search" onChange={e => this.inptChange(e)} value={this.state.inputVaule}   name="city" placeholder="输入学校、商务楼、地址" className="city_input input_style"  />
            </div>
            <div>
                <button  className="city_submit input_style" onClick={this.postpois.bind(this)}>提交</button>
            </div>
          </section>
          <ul className="getpois_ul">
            {this.state.placelist.map((item:any,i:any)=>{
              return (
                <li key={i} onClick={this.nextpage.bind(this,i,item)}>
                   <h4 className="pois_name ellipsis">{item.name}</h4>
                   <p className="pois_address ellipsis">{item.address}</p>
                </li>
              )
            })}
          </ul>
          {
            this.state.placeNone?<div className="search_none_place">抱歉！无搜索结果</div>:''
          }
          {
           this.state.placelist.length? <footer className="clear_all_history" onClick={this.clearAll.bind}>清空所有</footer>:''
          }
		</div>
	)
  }
}