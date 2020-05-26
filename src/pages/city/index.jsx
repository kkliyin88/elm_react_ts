//about.js
import React from 'react';
import './index.css';
import {currentcity, searchplace} from '../../service/index.js';
import Header from '../../components/header/index.jsx';
export default class City extends React.Component {
  constructor(props) {
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
  initData(){
    if(this.props.location.state){
      this.setState({
        cityid:this.props.location.state.id,
        cityname:this.props.location.state.name
      })
    }else{
      this.setState({
        cityid: 11,
        cityname:'深圳'
      })
    }
  }
  inptChange(event){
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
  nextpage(index,geohash){

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
            {this.state.placelist.map((item,i)=>{
              return (
                <li key={i} onClick={this.nextpage(i,item.geohash)}>
                   <h4 className="pois_name ellipsis">{item.name}</h4>
                   <p className="pois_address ellipsis">{item.address}</p>
                </li>
              )
            })}
          </ul>
          {
            this.state.placeNone?<div className="search_none_place">抱歉！无搜索结果</div>:''
          }
		</div>
	)
  }
}