//about.js
import  React from 'react';
import './index.css';
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
    const foodNum =this.foodNum
    return (
      <section className="cart_module">
      
      // this.props.foods.specifications.length?
      {this.props.foods.specifications.length?<section className="cart_button">
          <transition name="showReduce">
              { foodNum?<span  >
                {/* onClick={this.props.removeOutCart(this.props.foods.category_id, this.props.foods.item_id, this.props.foods.specfoods[0].food_id, this.props.foods.specfoods[0].name, this.props.foods.specfoods[0].price, '', this.props.foods.specfoods[0].packing_fee, this.props.foods.specfoods[0].sku_id, this.props.foods.specfoods[0].stock)} */}
                <MinusCircleOutlined />
              </span>:''}
          </transition>
          <transition name="fade">
             { foodNum?<span className="cart_num" >{foodNum}</span>:''}
          </transition>
          <span className="add_icon" >
          {/* onClick={this.props.addToCart(this.props.category_id, this.props.item_id, this.props.specfoods[0].food_id, this.props.specfoods[0].name, this.props.specfoods[0].price, '', this.props.specfoods[0].packing_fee, this.props.specfoods[0].sku_id, this.props.specfoods[0].stock, 'event')} */}
             <PlusCircleOutlined />
          </span>
      </section>:
      <section  className="choose_specification">
          <section className="choose_icon_container">
              <transition name="showReduce">
                {foodNum?<span className="specs_reduce_icon" onClick={this.props.showReduceTip}>
                   <MinusCircleOutlined />
                </span>:''}
               
                  {/* <svg className="specs_reduce_icon" v-if="foodNum" >
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                  </svg> */}
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