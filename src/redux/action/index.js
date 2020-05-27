//修改当前所在的城市
const change_city = (value)=>{
    return {
        type:'change_city',
        value:value
    }
}
//修改当前所在的城市具体位置信息
const change_place = (value)=>{
    return {
        type:'change_place',
        value:value
    }
}
module.exports = {change_city,change_place}