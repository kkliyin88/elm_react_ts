//home.js
import * as React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { hotcity, groupcity } from "../../service/index.js";
import store from '../../redux/store';
import {change_city} from '../../redux/action';

interface appstase {
  groupcity: any,
  hotcity:[]
} 
interface historyItem { 
  name:String
}
interface groupcityItem { 
  name: String
}
export default class Home extends React.Component<any, any> {
                 constructor(props:Object) {
                   super(props);
                   this.state = {
                     groupcity: {},
                     hotcity: [],
                   };
                 }
                 getCityData() {
                   hotcity().then((res) => {
                     this.setState({
                       hotcity: res,
                     });
                   });
                   //获取所有城市
                   groupcity().then((res) => {
                     this.sortgroupcity(res);
                   });
                 }
                 sortgroupcity(groupcity:any) {
                   let sortobj:any = {};
                   for (let i = 65; i <= 90; i++) {
                     if (groupcity[String.fromCharCode(i)]) {
                       sortobj[String.fromCharCode(i)] =
                         groupcity[String.fromCharCode(i)];
                     }
                   }
                   this.setState({
                     groupcity: sortobj,
                   });
                 }
                 selectCity(city:Object):void {
                   // 存储当前选择的城市
                   let action = change_city(city);
                   store.dispatch(action);
                   this.props.history.push({ pathname: "/city" });
                 }
                 componentDidMount() {
                   this.getCityData();
                 }
                 public render() {
                   return (
                     <div>
                       <nav className="city_nav">
                         <div className="city_tip">
                           <span>当前定位城市：</span>
                           <span>定位不准时，请在城市列表中选择</span>
                         </div>
                       </nav>
                       <section id="hot_city_container">
                         <h4 className="city_title">热门城市</h4>
                         <ul className="citylistul">
                           {this.state.hotcity.map((item: historyItem, i:any) => {
                             return (
                               <li key={i}>
                                 <Link to={{ pathname: "city/", state: item }}>
                                   <span style={{ color: "#3190e8" }}>
                                     {item.name}
                                   </span>
                                 </Link>
                               </li>
                             );
                           })}
                         </ul>
                       </section>
                       <section className="group_city_container">
                         <ul className="letter_classify">
                           {Object.keys(this.state.groupcity).map((keyy:any, i:any) => {
                             return (
                               <li key={i} className="letter_classify_li">
                                 <h4 className="city_title">{keyy}</h4>
                                 <ul className="groupcity_name_container citylistul clear">
                                   {this.state.groupcity[keyy].map(
                                     (item: any,ii:any) => {
                                       return (
                                         <li
                                           onClick={this.selectCity.bind(
                                             this,item)}
                                           key={ii}
                                           className="ellipsis"
                                         >
                                           <span>{item.name}</span>
                                         </li>
                                       );
                                     }
                                   )}
                                 </ul>
                               </li>
                             );
                           })}
                         </ul>
                       </section>
                     </div>
                   );
                 }
               }
