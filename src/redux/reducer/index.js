
/**
 * 存储localStorage
 */
 const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}
/**
 * 获取localStorage
 */
const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}



/**
 * 删除localStorage
 */
const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

const initState ={
    city:{id:11,name:'深圳'},//所在城市
    place:{},//城市所选的具体位置,
    shopMsg:{}, //保存门店信息
    cartList:[],//加入购物车的商品列表
    test:123
}
//清空当前商品的购物车信息
function clear_cart(state, shopid) {
    let cartList = Object.assign({}, state.cartList) 
    cartList[shopid] = null;
    setStore('buyCart', state.cartList);
    return cartList
}
function add_cart(state,{
    shopid,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock
}) {     
        let cart = Object.assign({}, state.cartList);
		let shop = cart[shopid] = (cart[shopid] || {});
		let category = shop[category_id] = (shop[category_id] || {});
		let item = category[item_id] = (category[item_id] || {});
		if (item[food_id]) {
			item[food_id]['num']++;
		} else {
			item[food_id] = {
					"num" : 1,
					"id" : food_id,
					"name" : name,
					"price" : price,
					"specs" : specs,
					"packing_fee" : packing_fee,
					"sku_id" : sku_id,
					"stock" : stock
			};
        }
        //存入localStorage
        setStore('buyCart', cart);
		return cart
}
function reduce_cart(state, {
    shopid,
    category_id,
    item_id,
    food_id,
}) {
    let cart = Object.assign({}, state.cartList);
    let shop = (cart[shopid] || {});
    let category = (shop[category_id] || {});
    let item = (category[item_id] || {});
    if (item && item[food_id]) {
        if (item[food_id]['num'] > 0) {
            item[food_id]['num']--;
            //存入localStorage
         
        } else {
            //商品数量为0，则清空当前商品的信息
            item[food_id] = null;
        }
    }
    setStore('buyCart', cart);
    return cart
}

const reducer = (state=initState,action)=>{
    switch(action.type){ 
        case 'change_city':
            return Object.assign({}, state, {
                city:action.value
              })
            break;
        case 'change_place':
            return Object.assign({}, state, {
                place:action.value
              })
            break; 
        case 'change_shopMsg':
            return Object.assign({}, state, {
                shopMsg:action.value
              })
            break; 
        case 'add_cart':
            return Object.assign({}, state, {
                cartList: add_cart(state,action.value),
              })
            break; 
        case 'reduce_cart':
            return  Object.assign({}, state, {
                cartList: reduce_cart(state,action.value)
              });
            break;
        case 'clear_cart':
            return  Object.assign({}, state, {
                cartList: clear_cart(state,action.value),
                
              });
            break;                         
        default:
            return state
    }
}
module.exports={reducer};
