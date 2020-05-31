
import  React from 'react';
import './index.css';
import store from '../../redux/store';
import {add_cart,reduce_car,clear_cart} from '../../redux/action';
import {ShoppingCartOutlined,PlusOutlined,MinusCircleOutlined} from '@ant-design/icons';
import {shopDetails,foodMenu,ratingScores,ratingTags} from '../../service';
import Buycar from '../../components/buycar/index.jsx';
import { getImgPath} from '../../components/mixin.js';
import BScroll from 'better-scroll'
export default class Shop extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        geohash: '', //geohash位置信息
        shopId: 3269, //商店id值,
        shopCart:{},
        total:0, //在本店铺的购物车数量
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
  initCategoryNum=()=>{  //标记每个类目的购买数量
    let newArr = [];
    let cartFoodNum = 0;
    let cartFoodList = []
    this.state.menuList.forEach((item, index) => {
        if (this.state.shopCart&&this.state.shopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(this.state.shopCart[item.foods[0].category_id]).forEach(itemid => {
                Object.keys(this.state.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                    let foodItem = this.state.shopCart[item.foods[0].category_id][itemid][foodid];
                    num = num + foodItem.num;
                    if (item.type == 1) {
                        this.setState({
                            totalPrice:this.state.totalPrice + foodItem.num*foodItem.price
                        })
                        if (foodItem.num > 0) {
                            cartFoodList[cartFoodNum] = {};
                            cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                            cartFoodList[cartFoodNum].item_id = itemid;
                            cartFoodList[cartFoodNum].food_id = foodid;
                            cartFoodList[cartFoodNum].num = foodItem.num;
                            cartFoodList[cartFoodNum].price = foodItem.price;
                            cartFoodList[cartFoodNum].name = foodItem.name;
                            cartFoodList[cartFoodNum].specs = foodItem.specs;
                            cartFoodNum ++;
                        }
                    }
                })
            });
            console.log('cartFoodList_test',cartFoodList)
            this.setState({
                cartFoodList
            })
            newArr[index] = num;
        }else{
            newArr[index] = 0;
        }
    })
    this.setState({
        // totalPrice:this.state.totalPrice.toFixed(2),
        categoryNum:[...newArr]
    })
}
  // buycar中的方法
  listenInCart(){

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
                showSpecs:!this.state.showSpecs,
                specsIndex:0,
                choosedFoods:foods
            })
        }else{
            this.setState({
                showSpecs:!this.state.showSpecs,
                specsIndex:0
            })
        }
    }
    //获取食品列表的高度，存入shopListTop
    async getFoodListHeight(){
        let menuFoodList_li = await document.getElementsByClassName('menuFoodList_li');
        let  listArr = await Array.from(menuFoodList_li);
    }
    //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
    listenScroll(element){
        this.foodScroll = new BScroll(element, {
            probeType: 3,
            deceleration: 0.001,
            bounce: false,
            swipeTime: 2000,
            click: true,
        });

        const wrapperMenu = new BScroll('#wrapper_menu', {
            click: true,
        });
        const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
        this.foodScroll.on('scroll', (pos) => {
            if (!this.$refs.wrapperMenu) {
                return
            }
            this.shopListTop.forEach((item, index) => {
                if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
                    this.menuIndex = index;
                    const menuList=this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
                    const el = menuList[0];
                    wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
                }
            })
        })
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
  }
  
  //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
  removeOutCart(category_id, item_id, food_id, name, price, specs){
    let action =  reduce_car({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs})
    store.dispatch(action);
  }
  //购物车中总共商品的数量
  getTotalNum=()=>{
    let num = 1;
    this.state.cartFoodList.forEach(item => {
        num += item.num
    })
    console.log('getTotalNum',this.state.cartFoodList)
   this.setState({
       totalNum:num
   })
   }
   getShopCart=()=>{
       let cartList = store.getState().cartList;
       let shopCart = {};
       if(cartList&&cartList[this.state.shopId]){
        shopCart = cartList[this.state.shopId]; 
       }
       this.setState({
            shopCart:shopCart
       })
       this.initCategoryNum();
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
    this.getFoodListHeight();
    store.subscribe(this.getTotalNum); //购物车数量
    store.subscribe(this.getShopCart); // 购物车列表
    
  }
  render() {
    const deliveryFee = this.deliveryFee;
    const minimumOrderAmount = this.minimumOrderAmount;
    return (
      <div>
        <section className="shop_container">
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
            <div >
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
                                    return (<li key={index} className='menuFoodList_li'>
                                        <header className="menu_detail_header">
                                            <section className="menu_detail_header_left">
                                                <strong className="menu_item_title">{item.name}</strong>
                                                <span className="menu_item_description">{item.description}</span>
                                            </section>
                                            <span className="menu_detail_header_right" onClick={this.showTitleDetail.bind(this,index)}></span>
                                        { this.state.TitleDetailIndex==index?<p className="description_tip" >
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
                                                            <Buycar shopId={this.state.shopId} foods={foods} moveInCart={this.listenInCart} showChooseList={this.showChooseList.bind(this)} showReduceTip={this.showReduceTip} showMoveDot={this.showMoveDotFun}> </Buycar>
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
                            <section onClick={this.toggleCartList} className="cart_icon_num">
                            <div className={`cart_icon_container ${this.state.totalPrice > 0?'cart_icon_activity':''} ${this.state.receiveInCart?'move_in_cart':''}`}  ref="cartContainer">
                                <span className="cart_list_length">
                                    {this.state.totalNum||0}
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
                            :<span className="gotopay_button_style">去结算</span>}
                            {/* <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" className="gotopay_button_style" v-else >去结算</router-link> */}
                        </section>
                    </section>
                    <div className="toggle-cart" >
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
                                                    <MinusCircleOutlined />
                                                    </span>
                                                    <span className="cart_num">{item.num}</span>
                                                    <span className="cart_add" onClick={this.addToCart.bind(this,item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)}>
                                                        <PlusOutlined />
                                                    </span>
                                                </section>
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            </section>
                        </section>:''}
                    </div>
                    <div className="fade">
                        {this.state.showCartList&&this.state.cartFoodList.length?<div className="screen_cover"  onClick={this.toggleCartList}></div>:''}
                    </div>
                </section>
            </div >
        </section>
        <section name="fadeBounce">
            {this.state.showSpecs?<div className="specs_list" >
                <header className="specs_list_header">
                    <h4 className="ellipsis">{this.state.choosedFoods.name}</h4>
                    {/* <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1"className="specs_cancel" @click="showChooseList">
                        <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
                        <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
                    </svg> */}
                </header>
                <section className="specs_details">
                    <h5 className="specs_details_title">{this.state.choosedFoods.specifications[0].name}</h5>
                    <ul>
                        { this.state.choosedFoods.specifications[0].values.map((item,index)=>{
                            return (
                                <li  className={`${index ===this.state.specsIndex?'specs_activity':''}`} onClick={this.chooseSpecs.bind(this,index)}>
                                    {item}
                                </li>  
                            )
                        })}
                    </ul>
                </section>
                <footer className="specs_footer">
                    <div className="specs_price">
                        <span>¥ </span>
                        <span>{this.state.choosedFoods.specfoods[this.state.specsIndex].price}</span>
                    </div>
                    <div className="specs_addto_cart" onClick={this.addSpecs.bind(this,this.state.choosedFoods.category_id, this.state.choosedFoods.item_id, this.state.choosedFoods.specfoods[this.state.specsIndex].food_id, this.state.choosedFoods.specfoods[this.state.specsIndex].name, this.state.choosedFoods.specfoods[this.state.specsIndex].price, this.state.choosedFoods.specifications[0].values[this.state.specsIndex], this.state.choosedFoods.specfoods[this.state.specsIndex].packing_fee, this.state.choosedFoods.specfoods[this.state.specsIndex].sku_id, this.state.choosedFoods.specfoods[this.state.specsIndex].stock)}>加入购物车</div>
                </footer>
            </div>:''}
        </section>
        <section name="fade">
            {this.state.showDeleteTip?<p className="show_delete_tip" v-if="showDeleteTip">多规格商品只能去购物车删除哦</p>:''}
        </section>
      </div>
    )
  }
}