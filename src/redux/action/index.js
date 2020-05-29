//修改当前所在的城市
export const change_city = (value)=>{
    return {
        type:'change_city',
        value:value
    }
}
//修改当前所在的城市具体位置信息
export const change_place = (value)=>{
    return {
        type:'change_place',
        value:value
    }
}
export const change_shopMsg = (value)=>{
    return {
        type:'change_shopMsg',
        value:value
    }
}
export const add_cart = (value)=>{
    return {
        type:'add_cart',
        value:value
    }
}
export const reduce_car = (value)=>{
    return {
        type:'reduce_car',
        value:value
    }
}
//清楚购物车
export const clear_cart = (value)=>{
    return {
        type:'clear_cart',
        value:value
    }
}
// module.exports = {change_city,change_place,change_shopMsg,add_cart,reduce_car}