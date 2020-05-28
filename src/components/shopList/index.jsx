
import  React from 'react';
import './index.css';
import {shopList} from '../../service'
import Start from '../start/index.jsx';
import store from '../../redux/store';
import {change_shopMsg} from '../../redux/action';
const imgBaseUrl = '/img/'
export default class ShopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
			shopListArr:[], // 店铺列表数据
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			showBackStatus: false, //显示返回顶部按钮
			showLoading: true, //显示加载动画
			touchend: false, //没有更多数据
			imgBaseUrl,
    }
  }
  //获取店铺列表
  async getShopList(){
     let res = await shopList(store.getState().place.latitude, store.getState().place.longitude);
    this.setState({
      shopListArr:res
    })
  }
  gotoShop(shopMsg){
    let action = change_shopMsg(shopMsg) //存储门店信息
    store.dispatch(action);
    console.log('history',this.props);
    
    this.props.history.push({pathname:'/shop'});
  }
  zhunshi(supports){
    let zhunStatus;
    if ((supports instanceof Array) && supports.length) {
       supports.forEach(item => {
         if (item.icon_name === '准') {
           zhunStatus = true;
         }
       })
    }else{
      zhunStatus = false;
    }
    return zhunStatus
  }
  componentDidMount() {
    this.getShopList();
  }
  render() {
    return (
      <div className="shoplist_container">
         {this.state.shopListArr.length>0?<ul>
            {this.state.shopListArr.map((item,index)=>{
              return (
                <li onClick={this.gotoShop.bind(this,item)} className="shop_li" key={index} >
                   <section>
                    <img src={`${imgBaseUrl}${item.image_path}`} className="shop_img" />
                  </section>
                  <hgroup className="shop_right">
                    <header className="shop_detail_header">
                      <h4 className='shop_title ellipsis'>{item.name}</h4>
                      <ul className="shop_detail_ul">
                        {
                          item.supports.map((item2,index2)=>{
                            return <li key={index2} className="supports">{item.icon_name}</li>
                          })
                        }
                    </ul>
                    </header>
                    <h5 className="rating_order_num">
                      <section className="rating_order_num_left">
                        <section className="rating_section" >
                          <div style={{display:'inlineBlock',marginTop:'-12px'}}>
                             <Start  startNum={item.rating} style={{color:'red'}} />
                          </div>
                          <span className="rating_num">{item.rating}</span>
                        </section>
                        <section className="order_section">
                          月售{item.recent_order_num}单
                        </section>
                      </section>
                      <section className="rating_order_num_right">
                        {
                           item.delivery_mode?<span className="delivery_style delivery_left">{item.delivery_mode.text}</span>:''
                        }
                        {
                         this.zhunshi(item.supports)? <span className="delivery_style delivery_right">准时达</span>:''
                        }
                      </section>
                    </h5>
                    <h5 className="fee_distance">
                      <p className="fee">
                        ¥{item.float_minimum_order_amount}起送
                        <span class="segmentation">/</span>
                        {item.piecewise_agent_fee.tips}
                      </p>
                      <p className="distance_time">
                        {Number(item.distance)?<span>{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}
                          <span className="segmentation">/</span>
                        </span>:''}
                        <span v-else>{item.distance}</span>
                        <span className="segmentation">/</span>
                        <span className="order_time">{item.order_lead_time}</span>
                      </p>
                    </h5>
                  </hgroup>
                </li>
              )
            })}
          </ul>:''}
          {
            this.state.shopListArr.length<1?<ul  className="animation_opactiy">
              {new Array(10).map((item,i)=>{
                return (
                  <li className="list_back_li"  key={i}>
                    <img src="../../images/shopback.svg" className="list_back_svg" />
                  </li> 
                )
              })}
          </ul>:''
          }
      </div>
  )
  }
}