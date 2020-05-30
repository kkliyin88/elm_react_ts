
import  React from 'react';
import './index.css';
import store from '../../redux/store';
import {add_cart,reduce_car,clear_cart} from '../../redux/action';
import {ShoppingCartOutlined,PlusOutlined,MinusCircleOutlined} from '@ant-design/icons';
import {shopDetails,foodMenu,ratingScores,ratingTags} from '../../service';
import Buycar from '../../components/buycar/index.jsx';
import { getImgPath} from '../../components/mixin.js'
export default class Shop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        geohash: '', //geohash位置信息
        shopId: 3269, //商店id值,
        test:'',
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
  chooseMenu(index){
    this.setState({
        menuIndex: index,
        menuIndexChange: false
    })
    //menuIndexChange解决运动时listenScroll依然监听的bug
    // this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
    // this.foodScroll.on('scrollEnd', () => {
    //     this.menuIndexChange = true;
    // })
  }
  showTitleDetail(index){
    if (this.state.TitleDetailIndex == index) {
        this.setState({
            TitleDetailIndex:null
        })
       
    }else{
        this.setState({
            TitleDetailIndex:index
        })
    }
}
  
  //控制购物列表是否显示
  toggleCartList(){
      this.setState({
        showCartList:this.state.cartFoodList.length ?!this.state.showCartList:true
      })
 }
  //清除购物车
  clearCart(){
    this.toggleCartList();
    let action= clear_cart(this.state.shopId)
    store.dispatch(action);
  }
  initCategoryNum(){
    let newArr = [];
    let cartFoodNum = 0;
    this.setState({
        totalPrice:0,
        cartFoodList:[]
    })
    this.menuList.forEach((item, index) => {
        if (this.shopCart&&this.shopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
                Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                    let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
                    num += foodItem.num;
                    if (item.type == 1) {
                        this.setState({
                            totalPrice:this.state.totalPrice + foodItem.num*foodItem.price
                        })
                        if (foodItem.num > 0) {
                            let cartFoodList = Object.assign({},this.state.cartFoodList);
                            cartFoodList[cartFoodNum] = {};
                            cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                            cartFoodList[cartFoodNum].item_id = itemid;
                            cartFoodList[cartFoodNum].food_id = foodid;
                            cartFoodList[cartFoodNum].num = foodItem.num;
                            cartFoodList[cartFoodNum].price = foodItem.price;
                            cartFoodList[cartFoodNum].name = foodItem.name;
                            cartFoodList[cartFoodNum].specs = foodItem.specs;
                            cartFoodNum ++;
                            this.setState({
                                cartFoodList
                            })
                        }
                    }
                })
            })
            newArr[index] = num;
        }else{
            newArr[index] = 0;
        }
    })
    this.setState({
        totalPrice:this.state.totalPrice.toFixed(2),
        categoryNum:[...newArr]
    })
}
  // buycar中的方法
  listenInCart(){

  }
  showChooseList(){

  }
  //显示提示，无法减去商品
  showReduceTip(){
    this.showDeleteTip = true;
    this.setState({
        showDeleteTip:true
    })
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.setState({
            showDeleteTip:false
        })
    }, 3000);
  }

  showMoveDotFun(){

  }
    //隐藏动画
    hideLoading(){
        this.setState({
            showLoading:false 
        })
    }
    //显示规格列表
    showChooseList(foods){
        if (foods) {
            this.setState({
                showSpecs:!this.sate.showSpecs,
                specsIndex:0,
                choosedFoods:foods
            })
        }else{
            this.setState({
                showSpecs:!this.sate.showSpecs,
                specsIndex:0
            })
        }
    }
    //记录当前所选规格的索引值
    chooseSpecs(index){
     this.setState({
        specsIndex:index
     })
    }
    //多规格商品加入购物车
    addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
        let action = add_cart({shopid: this.sate.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
        store.dispatch(action);
        this.showChooseList();
    }
   //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
   addToCart(category_id, item_id, food_id, name, price, specs){
    let action = add_cart({shopid: this.sate.shopId, category_id, item_id, food_id, name, price, specs});
    store.dispatch(action);
    console.log('shopCart_add',store.getState().carList);
  }
  
  //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  removeOutCart(category_id, item_id, food_id, name, price, specs){
    let action =  reduce_car({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs})
    store.dispatch(action);
  }
  //购物车中总共商品的数量
  get totalNum(){
    let num = 0;
    this.state.cartFoodList.forEach(item => {
        num += item.num
    })
    return num
   }
   get shopCart(){
       let carList = store.getState().carList;
       if(carList&&carList[this.state.shopId]){
        return {...carList[this.state.shopId]}; 
       }
    }
   get deliveryFee(){
        if (this.state.shopDetailData) {
            return this.state.shopDetailData.float_delivery_fee;
        }else{
            return null;
        }
    }
    //还差多少元起送，为负数时显示去结算按钮
   get minimumOrderAmount() {
        if (this.state.shopDetailData) {
            return this.state.shopDetailData.float_minimum_order_amount - this.state.totalPrice;
        }else{
            return null;
        }
    }
  componentDidMount() {
    this.initData();
    this.setState({
        test:store.getState().test
    })
  }
  render() {
    const totalNum =  this.totalNum;
    const deliveryFee = this.deliveryFee;
    const minimumOrderAmount = this.minimumOrderAmount;
    const shopCart = this.shopCart;
    console.log('shopCart1',this.state.test)
    return (
      <div className="shop_container">
          <header className="shop_detail_header"  >
            <div className="header_cover_img_con">
             <img src={`${this.state.imgBaseUrl}${this.state.shopDetailData.image_path}`} className="header_cover_img" /> 
            <sapn>{this.state.test}</sapn>
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
                <section className="menu_container">
                    <section className="menu_left" id="wrapper_menu" ref="wrapperMenu">
                        <ul>
                            {
                                this.state.menuList.map((item,index)=>{
                                    return (
                                        <li  key={index} className={`menu_left_li ${index === this.state.menuIndex ?'activity_menu' :'' }`}  onClick={this.chooseMenu.bind(this,index)}>
                                            {item.icon_url?<img src={getImgPath.bind(this,item.icon_url)}  />:''}
                                            <span>{item.name}</span>
                                            {this.state.categoryNum[index]&&item.type===1?<span className="category_num" >{this.state.categoryNum[index]}</span>:''}
                                        </li>
                                    )
                                })
                                }
                        </ul>
                    </section>
                    <section className="menu_right" ref="menuFoodList">
                        <ul>
                            { this.state.menuList.map((item,index)=>{
                                return (<li key={index}>
                                    <header className="menu_detail_header">
                                        <section className="menu_detail_header_left">
                                            <strong className="menu_item_title">{item.name}</strong>
                                            <span className="menu_item_description">{item.description}</span>
                                        </section>
                                        <span className="menu_detail_header_right" onClick={this.showTitleDetail.bind(this,index)}></span>
                                    { this.state.TitleDetailIndex==index?<p class="description_tip" >
                                            <span>{item.name}</span>
                                            {item.description}
                                        </p>:''}
                                    </header>
                                    {
                                        item.foods.map((foods,foodindex)=>{
                                            return (
                                                <section key={foodindex} className="menu_detail_list" >
                                                    <div className="menu_detail_link">
                                                    <section className="menu_food_img">
                                                        <img src={this.state.imgBaseUrl + foods.image_path} />
                                                    </section>
                                                    <section className="menu_food_description">
                                                        <h3 className="food_description_head">
                                                            <strong className="description_foodname">{foods.name}</strong>
                                                            { foods.attributes.length?
                                                            <ul  className="attributes_ul">
                                                                {foods.attributes.map((attribute,foodindex)=>{
                                                                    if(!attribute) return false
                                                                    return (
                                                                       <li key={foodindex} className={`${attribute.icon_name === '新'?'attribute_new':''}` }>
                                                                             <p style={{color:`#${attribute.icon_name} === '新'?'fff':'attribute.icon_color'}` }}>{attribute.icon_name === '新'? '新品':attribute.icon_name}</p>
                                                                        </li>

                                                                    )
                                                                })
                                                                }
                                                            </ul>:''}
                                                        </h3>
                                                        <p className="food_description_content">{foods.description}</p>
                                                        <p className="food_description_sale_rating">
                                                            <span>月售{foods.month_sales}份</span>
                                                            <span>好评率{foods.satisfy_rate}%</span>
                                                        </p>
                                                        {foods.activity?<p className="food_activity">
                                                        <span style={{color:`#${foods.activity.image_text_color}`,borderColor:`#${foods.activity.icon_color}`}}>
                                                            {foods.activity.image_text}
                                                        </span>
                                                        </p>:''}
                                                    </section>
                                                    </div>
                                                    <footer className="menu_detail_footer">
                                                        <section className="food_price">
                                                            <span>¥</span>
                                                            <span>{foods.specfoods[0].price}</span>
                                                            {foods.specifications.length?<span>起</span>:''}
                                                        </section>
                                                        <Buycar shopId={this.state.shopId} foods={foods} moveInCart={this.listenInCart} showChooseList={this.showChooseList} showReduceTip={this.showReduceTip} showMoveDot={this.showMoveDotFun}> </Buycar>
                                                    </footer>
                                                </section> 
                                            )
                                        })
                                    }
                            </li>)})}
                        </ul>
                    </section>
                </section>
                <section className="buy_cart_container">
                        <section oncClick={this.toggleCartList} className="cart_icon_num">
                        <div className={`cart_icon_container ${this.state.totalPrice > 0?'cart_icon_activity':''} ${this.state.receiveInCart?'move_in_cart':''}`} class="cart_icon_container" ref="cartContainer">
                            <span className="cart_list_length">
                                {totalNum}
                            </span>
                            <ShoppingCartOutlined /> 
                        </div>
                        <div className="cart_num">
                            <div>¥ {this.state.totalPrice}</div>
                            <div>配送费¥{deliveryFee}</div>
                        </div>
                    </section>
                    <section className={`gotopay ${this.state.minimumOrderAmount <= 0?'gotopay_acitvity':''}`} >
                        {minimumOrderAmount?<span className="gotopay_button_style" >还差¥{minimumOrderAmount}起送</span>
                        :<sapn className="gotopay_button_style">去结算</sapn>}
                        {/* <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" class="gotopay_button_style" v-else >去结算</router-link> */}
                    </section>
                </section>
                <transition className="toggle-cart" name='aa'>
                   { this.state.showCartList&&this.state.cartFoodList.length?
                   <section className="cart_food_list" >
                        <header>
                            <h4>购物车</h4>
                            <div onClick={this.clearCart}>
                                {/* <svg>
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                                </svg> */}
                                <span className="clear_cart">清空</span>
                            </div>
                        </header>
                        <section className="cart_food_details" id="cartFood">
                            <ul>
                                { 
                                this.state.cartFoodList((item,index)=>{
                                    return (
                                        <li key={index} className="cart_food_li">
                                            <div className="cart_list_num">
                                                <p className="ellipsis">{item.name}</p>
                                                <p className="ellipsis">{item.specs}</p>
                                            </div>
                                            <div className="cart_list_price">
                                                <span>¥</span>
                                                <span>{item.price}</span>
                                            </div>
                                            <section className="cart_list_control">
                                                <span onClick={this.removeOutCart.bind(this,item.category_id, item.item_id, item.food_id, item.name, item.price,item.specs)}>
                                                sm<MinusCircleOutlined />
                                                    {/* <svg>
                                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                                    </svg> */}
                                                </span>
                                                <span className="cart_num">{item.num}</span>
                                                <span className="cart_add" onClick={this.addToCart.bind(this,item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)}>
                                                   ss <PlusOutlined />
                                                </span>
                                                
                                                {/* <svg className="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                                                </svg> */}
                                            </section>
                                        </li>
                                    )
                                })
                                }
                            </ul>
                        </section>
                    </section>:''}
                </transition>
                <transition className="fade">
                    {this.state.showCartList&&this.state.cartFoodList.length?<div class="screen_cover"  onClick={this.toggleCartList}></div>:''}
                </transition>
            </section>
          </transition >
    
      </div>
    )
  }
}