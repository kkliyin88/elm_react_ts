
import  React from 'react';
import './index.css';
import store from '../../redux/store';
import {shopDetails,foodMenu,ratingScores,ratingTags} from '../../service'
export default class About extends React.Component {
  constructor(props){
    super(props);
    console.log('store',store.getState());
    
    this.state = {
      geohash: '', //geohash位置信息
                shopId: 3269, //商店id值,

                // geohash:store.getState().city.geohash,
                showLoading: true, //显示加载动画
                changeShowType: 'food',//切换显示商品或者评价
                shopDetailData: {}, //商铺详情
                showActivities: false, //是否显示活动详情
                menuList: [], //食品列表
                menuIndex: 0, //已选菜单索引值，默认为0
                menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
                shopListTop: [], //商品列表的高度集合
                TitleDetailIndex: null, //点击展示列表头部详情
                categoryNum: [], //商品类型右上角已加入购物车的数量
                totalPrice: 0, //总共价格
                cartFoodList: [], //购物车商品列表
                showCartList: false,//显示购物车列表
                receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
                ratingList: null, //评价列表
                ratingOffset: 0, //评价获取数据offset值
                ratingScoresData: null, //评价总体分数
                ratingTagsList: null, //评价分类列表
                ratingTageIndex: 0, //评价分类索引
                preventRepeatRequest: false,// 防止多次触发数据请求
                ratingTagName: '',//评论的类型
                loadRatings: false, //加载更多评论是显示加载组件
                foodScroll: null,  //食品列表scroll
                showSpecs: false,//控制显示食品规格
                specsIndex: 0, //当前选中的规格索引值
                choosedFoods: null, //当前选中视频数据
                showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
                showMoveDot: [], //控制下落的小圆点显示隐藏
                windowHeight: null, //屏幕的高度
                elLeft: 0, //当前点击加按钮在网页中的绝对top值
                elBottom: 0, //当前点击加按钮在网页中的绝对left值
                ratingScroll: null, //评论页Scroll
                imgBaseUrl:'/img/',
                latitude: 32.095092, 
                longitude: 118.914433
    }
  }
  //name: "美食店111222", address: "广东省潮州市潮安区 ", id: 3269, latitude: 32.095092, longitude: 118.914433
  async initData(){
    //评论列表
    // this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
   
    this.setState({
      shopDetailData:await shopDetails(this.state.shopId, this.state.latitude, this.state.longitude),
      menuList:await foodMenu(this.state.shopId),//获取商铺食品列表
      ratingScoresData: await ratingScores(this.state.shopId),//商铺评论详情
      ratingTagsList : await ratingTags(this.state.shopId)//评论Tag列表
    })
    console.log('shopDetailData',this.state.shopDetailData)
  }
  componentDidMount() {
    this.initData();
  }
  render() {
    return (
      <div className="shop_container">
          <header className="shop_detail_header"  >
            <div className="header_cover_img_con">
             <img src={`${this.state.imgBaseUrl}${this.state.shopDetailData.image_path}`} className="header_cover_img" /> 
            </div>
            <section className="description_header">
                <div className="description_top">
                  <section className="description_left">
                  <img src={`${this.state.imgBaseUrl}${this.state.shopDetailData.image_path}`} className="header_cover_img" />
                    </section>
                    <section className="description_right">
                        <h4 className="description_title ellipsis">{this.state.shopDetailData.name}</h4>
                        <p className="description_text">商家配送／{this.state.shopDetailData.order_lead_time}分钟送达／配送费¥{this.state.shopDetailData.float_delivery_fee}</p>
                        <p className="description_promotion ellipsis">公告：{this.state.promotionInfo}</p>
                    </section>
                </div>
            </section>
          </header>
          <transition name="fade-choose">
            <section  className="food_container">
            
            </section>
          </transition >
         
    {/* <section v-show="changeShowType =='food'" class="food_container">
        <section class="menu_container">
            <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                <ul>
                    <li v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                        <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
                        <span>{{item.name}}</span>
                        <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{categoryNum[index]}}</span>
                    </li>
                </ul>
            </section>
            <section class="menu_right" ref="menuFoodList">
                <ul>
                    <li v-for="(item,index) in menuList" :key="index">
                        <header class="menu_detail_header">
                            <section class="menu_detail_header_left">
                                <strong class="menu_item_title">{{item.name}}</strong>
                                <span class="menu_item_description">{{item.description}}</span>
                            </section>
                            <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                            <p class="description_tip" v-if="index == TitleDetailIndex">
                                <span>{{item.name}}</span>
                                {{item.description}}
                            </p>
                        </header>
                        <section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                            <router-link  :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                                <section class="menu_food_img">
                                    <img :src="imgBaseUrl + foods.image_path">
                                </section>
                                <section class="menu_food_description">
                                    <h3 class="food_description_head">
                                        <strong class="description_foodname">{{foods.name}}</strong>
                                        <ul v-if="foods.attributes.length" class="attributes_ul">
                                            <li v-if="attribute" v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' + attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">
                                                <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                                            </li>
                                        </ul>

                                    </h3>
                                    <p class="food_description_content">{{foods.description}}</p>
                                    <p class="food_description_sale_rating">
                                        <span>月售{{foods.month_sales}}份</span>
                                        <span>好评率{{foods.satisfy_rate}}%</span>
                                    </p>
                                    <p v-if="foods.activity" class="food_activity">
                                    <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                                    </p>
                                </section>
                            </router-link>
                            <footer class="menu_detail_footer">
                                <section class="food_price">
                                    <span>¥</span>
                                    <span>{{foods.specfoods[0].price}}</span>
                                    <span v-if="foods.specifications.length">起</span>
                                </section>
                                <buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                            </footer>
                        </section>
                    </li>
                </ul>
            </section>
        </section>
        <section class="buy_cart_container">
            <section @click="toggleCartList" class="cart_icon_num">
                <div class="cart_icon_container" :class="{cart_icon_activity: totalPrice > 0, move_in_cart:receiveInCart}" ref="cartContainer">
                    <span v-if="totalNum" class="cart_list_length">
                        {{totalNum}}
                    </span>
                    <svg class="cart_icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                    </svg>
                </div>
                <div class="cart_num">
                    <div>¥ {{totalPrice}}</div>
                    <div>配送费¥{{deliveryFee}}</div>
                </div>
            </section>
            <section class="gotopay" :class="{gotopay_acitvity: minimumOrderAmount <= 0}">
                <span class="gotopay_button_style" v-if="minimumOrderAmount > 0">还差¥{{minimumOrderAmount}}起送</span>
                <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" class="gotopay_button_style" v-else >去结算</router-link>
            </section>
        </section>
        <transition name="toggle-cart">
            <section class="cart_food_list" v-show="showCartList&&cartFoodList.length">
                <header>
                    <h4>购物车</h4>
                    <div @click="clearCart">
                        <svg>
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                        </svg>
                        <span class="clear_cart">清空</span>
                    </div>
                </header>
                <section class="cart_food_details" id="cartFood">
                    <ul>
                        <li v-for="(item, index) in cartFoodList" :key="index" class="cart_food_li">
                            <div class="cart_list_num">
                                <p class="ellipsis">{{item.name}}</p>
                                <p class="ellipsis">{{item.specs}}</p>
                            </div>
                            <div class="cart_list_price">
                                <span>¥</span>
                                <span>{{item.price}}</span>
                            </div>
                            <section class="cart_list_control">
                                <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                    <svg>
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                    </svg>
                                </span>
                                <span class="cart_num">{{item.num}}</span>
                                <svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                                </svg>
                            </section>
                        </li>
                    </ul>
                </section>
            </section>
        </transition>
        <transition name="fade">
            <div class="screen_cover" v-show="showCartList&&cartFoodList.length" @click="toggleCartList"></div>
        </transition>
    </section>
</transition> */}
      </div>
    )
  }
}