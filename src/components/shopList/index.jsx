
import  React from 'react';
// import './index.css';
import {shopList} from '../../service'
import {showBack, animate} from '../../service/mUtils'
// import {loadMore, getImgPath} from '../mixin'
// import loading from './common/loading'
// import ratingStar from './common/ratingStar'
import store from '../../redux/store';
const imgBaseUrl = '//elm.cangdu.org/img/'
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
    console.log('state111',this.state);
  }

  componentDidMount() {
    this.getShopList();
  }
  render() {
    return (
      <div className="shoplist_container">
          {this.state.shopListArr}
          {/* <ul>
            
            {this.state.shopListArr.map((item,index)=>{
              return (
                <li></li>
              )
            })}
          </ul> */}
         {/* {
           <div class="shoplist_container">
           <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
             <router-link :to="{path: 'shop', query:{geohash, id: item.id}}" v-for="item in shopListArr" tag='li' :key="item.id" class="shop_li">
               <section>
                 <img :src="imgBaseUrl + item.image_path" class="shop_img">
               </section>
               <hgroup class="shop_right">
                 <header class="shop_detail_header">
                   <h4 :class="item.is_premium? 'premium': ''" class="" class="shop_title ellipsis">{{item.name}}</h4>
                   <ul class="shop_detail_ul">
                     <li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
                   </ul>
                 </header>
                 <h5 class="rating_order_num">
                   <section class="rating_order_num_left">
                     <section class="rating_section">
                       <rating-star :rating='item.rating'></rating-star>
                       <span class="rating_num">{{item.rating}}</span>
                     </section>
                     <section class="order_section">
                       月售{{item.recent_order_num}}单
                     </section>
                   </section>
                   <section class="rating_order_num_right">
                     <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
                     <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
                   </section>
                 </h5>
                 <h5 class="fee_distance">
                   <p class="fee">
                     ¥{{item.float_minimum_order_amount}}起送
                     <span class="segmentation">/</span>
                     {{item.piecewise_agent_fee.tips}}
                   </p>
                   <p class="distance_time">
                     <span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
                       <span class="segmentation">/</span>
                     </span>
                     <span v-else>{{item.distance}}</span>
                     <span class="segmentation">/</span>
                     <span class="order_time">{{item.order_lead_time}}</span>
                   </p>
                 </h5>
               </hgroup>
             </router-link>
           </ul>
           <ul v-else class="animation_opactiy">
             <li class="list_back_li" v-for="item in 10" :key="item">
               <img src="../../images/shopback.svg" class="list_back_svg">
             </li>
           </ul>
           <p v-if="touchend" class="empty_data">没有更多了</p>
           <aside class="return_top" @click="backTop" v-if="showBackStatus">
             <svg class="back_top_svg">
               <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
             </svg>
           </aside>
           <div ref="abc" style="background-color: red;"></div>
           <transition name="loading">
             <loading v-show="showLoading"></loading>
           </transition>
         </div>
         } */}
      </div>
      
     
  )
  }
}