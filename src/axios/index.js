
import axios from 'axios';//引入axios


// export function Axios(url,data,type){
// 	if(type==='post'||type==='POST'){
// 		post(url,data)
// 	}else{
// 		get(url,data)
// 	}
// } 
export function post(path,data,options={}){
  let pathIsJson = /\.json$/.test(path);
  if(pathIsJson){
    return get(path,data,options)
  }
  
  return new Promise((resolve,reject)=>{
    axios.post(path,data,options).then((res)=>{
      resolve(res.data);
    }).catch((err)=>{
      reject(err);
      console.log(err,err);
    })
  }).catch((err)=>{
      console.log(err,err);
    })
}

export function get(url,data,options={}){
  return new Promise(function(resolve,reject){
	let dataStr = ''; //数据拼接字符串
	let path = ''
	Object.keys(data).forEach(key => {
		dataStr += key + '=' + data[key] + '&';
	})
	if (dataStr !== '') {
		dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
		path = url + '?' + dataStr;
	}
    axios.get(path,data,options).then((res)=>{
      resolve(res.data);
    }).catch((err)=>{
      reject(err);
      console.log(err,err);
    })
  }).catch((err)=>{
     console.log(err,err);
    })
}

