const initState ={
    city:{id:11,name:'深圳'},//所在城市
    place:{},//城市所选的具体位置,
    shopMsg:{}, //保存门店信息
    cartList:{}//加入购物车的商品列表
}
function add_card(state,value){
        console.log('shopid_func',value.shopid)
        let cart = state.cartList;
		let shop = cart[value.shopid] = (cart[value.shopid] || {});
		let category = shop[value.category_id] = (shop[value.category_id] || {});
		let item = category[value.item_id] = (category[value.item_id] || {});
		if (item[value.food_id]) {
			item[value.food_id]['num']++;
		} else {
			item[value.food_id] = {
					"num" : 1,
					"id" : value.food_id,
					"name" : value.name,
					"price" : value.price,
					"specs" : value.specs,
					"packing_fee" : value.packing_fee,
					"sku_id" : value.sku_id,
					"stock" : value.stock
			};
        }
        console.log('cart-',cart)
		return cart
}
const reducer = (state=initState,action)=>{
    console.log('触发了reducer',action)
    switch(action.type){ 
        case 'change_city':
            return {
                city:action.value
            };
            break;
        case 'change_place':
            return {
                place:action.value
            };
            break; 
        case 'change_shopMsg':
            return {
                shopMsg:action.value
            };
            break; 
        case 'add_cart':
           let cart= add_card(state,action.value)
            return {
                cartList:cart
            };
            break;              
        default:
            return state
    }
}
module.exports={reducer};
