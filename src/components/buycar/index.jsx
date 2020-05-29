//about.js
import  React from 'react';
import './index.css';
import store from '../../redux/store';
import {add_cart,reduce_car} from '../../redux/action';
import {MinusCircleOutlined,PlusCircleOutlined} from '@ant-design/icons';
export default class Buycar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showMoveDot: [], //控制下落的小圆点显示隐藏
    }
  }
  showChooseList(food){

  }
  //加入购物车，计算按钮位置。
  addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event){
    let action = add_cart({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
    store.dispatch(action);
    //this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
    // let elLeft = event.target.getBoundingClientRect().left;
    // let elBottom = event.target.getBoundingClientRect().bottom;
    // this.showMoveDot.push(true);
    // this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
   }
  removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
    let action =  reduce_car({shopid: this.props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock})
    if (this.foodNum > 0) {
      store.dispatch(action);
     }
  }
  componentDidMount() {
   
  }
  get foodNum(){
    let category_id = this.props.foods.category_id;
    let item_id = this.props.foods.item_id;
    if (this.shopCart&&this.shopCart[category_id]&&this.shopCart[category_id][item_id]) {
        let num = 0;
        Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
            num += item.num;
        })
        return num;
    }else {
        return 0;
    }
  }
  get shopCart(){
    return {}
    // return Object.assign({},this.cartList[this.props.shopId]);
  }
  render() {
    const foodNum =this.foodNum;
    const foods = this.props.foods
    console.log('foods_cart',foods);
    return (
      <section className="cart_module">
      
      // this.props.foods.specifications.length?
      {this.props.foods.specifications.length?<section className="cart_button">
          <transition name="showReduce">
              { foodNum?<span  onClick={this.removeOutCart.bind(this,foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)} >
                {/* this.props.foods.category_id, this.props.foods.item_id, this.props.foods.specfoods[0].food_id, this.props.foods.specfoods[0].name, this.props.foods.specfoods[0].price, '', this.props.foods.specfoods[0].packing_fee, this.props.foods.specfoods[0].sku_id, this.props.foods.specfoods[0].stock */}
                cm<MinusCircleOutlined />
              </span>:''}
          </transition>
          <transition name="fade">
             { foodNum?<span className="cart_num" >{foodNum}</span>:''}
          </transition>
          <span className="add_icon" onClick={this.addToCart.bind(this,foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, 'event')}>
          {/* this.props.foods.category_id, this.props.foods.item_id, this.props.foods.specfoods[0].food_id, this.props.foods.specfoods[0].name, this.props.foods.specfoods[0].price, '', this.props.foods.specfoods[0].packing_fee, this.props.foods.specfoods[0].sku_id, this.props.specfoods[0].stock, 'event' */}
             cs<PlusCircleOutlined />
          </span>
      </section>:
      <section  className="choose_specification">
          <section className="choose_icon_container">
              <transition name="showReduce">
                {foodNum?<span className="specs_reduce_icon" onClick={this.props.showReduceTip}>
                   <MinusCircleOutlined />
                </span>:''}
              </transition>
              <transition name="fade">
                 {foodNum?<span className="cart_num" >{foodNum}</span>:''}
              </transition>
              <span className="show_chooselist" >选规格</span> 
              {/* onClick={this.showChooseList.bine(this,this.props.foods)} */}
          </section>
      </section>}
  </section>
    )
  }
}