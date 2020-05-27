const initState ={
    city:{id:11,name:'深圳'},//所在城市
    place:{},//城市所选的具体位置
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
                city:action.value
            };
            break;           
        default:
            return state
    }
}
module.exports={reducer};
