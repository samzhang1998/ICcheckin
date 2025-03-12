<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/arrowleft.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <text class="title"> {{  activeday.toLocaleDateString('en-US', { month: 'long' })  }} {{ activeday.getFullYear()  }}</text>
            <image src="/static/arrowright.png" alt="logo" class="arrowimg arrowright" @click="nextWeek"/> 
        </view>
        <view class="days">
            <view class="dayitem"  v-for="(item, index) in weekDays" :key="index">
                <div class="item" :class="{'activeday': item.date==activeday}" @click="changeDay(item)">
                    <view class="day">{{ item.day }}</view>
                    <view class="weekdayday">{{ item.weekday }}</view> 
                </div> 
            </view>
        </view> 
        <view  class="nowday">
            {{activeday.toLocaleDateString('en-US', { weekday: 'long' }) }} - {{ activeday.getDate() }} {{  activeday.toLocaleDateString('en-US', { month: 'short' })  }} {{ activeday.getFullYear()  }}
        </view>
        <view class="times"> 
            <view class="timeitem"  v-for="time in 24" :key="time">
                <view class="lable"  v-if="time<12">{{ time}} am</view>
                <view class="lable"  v-if="time==12">Midday</view>
                <view class="lable"  v-if="time>12">{{ time}} pm</view>
                <view class="event"  >
                    <view   v-for="(event, index) in events" :key="index">
                        <view class="activeevent " v-if="12 == event.activetime">
                            <view class="left">
                                <view class="name">{{ event.description }} </view>
                                <view class="noee">{{ event.note }}</view>
                            </view>
                            <view class="right">
                                {{ event.righttxt }}
                            </view>
                        </view>
                    </view> 
                </view>
            </view> 
        </view>
	</view>
</template>
  
<script>
import { getEventsApi } from "@/api/events";
	export default {
        data() {
            return {
               weekDays: [],
               activeday:  new Date(), 
               events:[
                {
                    activetime:6,
                    description:"SEO Meeting with Lee Massage",
                    note:"note",
                    righttxt:"Shuoqi Wang"
                }
               ],
               userid:"",
               user:{}
            };
        },
		methods: {
            getEvents(){
                let params={
                    userId:this.userid
                }
                getEventsApi(this.userid,params).then((res)=>{
                    if(res.status ==1){
                        this.events = res.data 
                    } else{
                        uni.showModal({
                            content: res.msg,
                            confirmText: 'OK', 
                            showCancel:false
                        }) 
                        return 
                    }
                })
            },
            nextWeek(){
                let lastday = this.weekDays[6].date 
                let days = []
                for (let i = 1; i < 8; i++) { 
                    const day = new Date(lastday);
                    day.setDate(day.getDate() + i);
                    console.log(day.toDateString())
                    let item = {
                        day:day.getDate(),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days; 
                this.activeday = this.weekDays[0].date 
            },
            preWeek(){
                let lastday = this.weekDays[0].date 
                
                let days = []
                for (let i = 1; i < 8; i++) { 
                    const day = new Date(lastday);
                    day.setDate(day.getDate() - i);
                    let item = {
                        day:day.getDate(),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days.reverse();   
                this.activeday = this.weekDays[0].date 
            },
            changeDay(item){
                this.activeday = item.date 
                 
            }, 
            getWeekDays() {
                const today = new Date();
                this.activeday = new Date(today.setDate(today.getDate() - today.getDay()));
                const days = []; 
                for (let i = 0; i < 7; i++) {
                    const day = new Date(this.activeday); 
                    day.setDate(this.activeday.getDate() + i);
                    let item = {
                        day:day.getDate(),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days; 
            },
            getUserInfo(){
                this.user.token = uni.getStorageSync("token");  
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return 
                }
                this.ismanager = false
                this.user.email = uni.getStorageSync("email");  
                this.userid = uni.getStorageSync("id");  
                
                this.getWeekDays();
                this.getEvents()
            }
		},
        onShow () {
            this.getUserInfo() 
        },
        mounted() {
            
        },
        
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{
        .times{
            padding: 15rpx;
            .timeitem{
                display: flex;
                .activeevent{
                    display: flex;
                    justify-content: space-between;
                    height: 80rpx;
                    padding-left: 10rpx;
                    padding-right: 10rpx;
                    background-color:  rgba(239, 196, 98, 0.20);
                    border-left: 2px solid #EFC462;;
                    .right{
                        color: #101828; 
                        font-family: Nunito;
                        font-size: 10px;
                        font-style: normal;
                        font-weight: 600;
                        line-height: normal;
                        letter-spacing: -0.2px;
                        text-align: right;
                        padding-top: 25rpx;
                    }
                    .left{
                        .noee{
                            color: #838383; 
                            font-family: Nunito;
                            font-size: 8px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 40rpx;
                            letter-spacing: -0.16px;
                        }
                        .name{
                            color: #101828; 
                            font-family: Nunito;
                            font-size: 10px;
                            font-style: normal;
                            font-weight: 600;
                            line-height: 40rpx;
                            letter-spacing: -0.2px;
                        }
                    }
                }
                .lable{
                    width: 90rpx; 
                    color: #7B7B7B;
                    text-align: left;
                    font-family: Nunito;
                    font-size: 10px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: -0.2px;
                }
                .event{ 
                    width: 590rpx;
                    height: 80rpx;
                    border-bottom: 1px solid #DADADA;
                }
            }
        }
        .nowday{
            padding: 15rpx;
            color: #000; 
            font-family: Nunito;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.24px;
            border-bottom: 1px solid #CDCDCD;;
        }
        .header{
            padding: 15rpx;
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
            
            .arrowimg{
                width:48rpx;
                height: 48rpx;
            }
            .title{
                color: var(--Color-Text-Primary, #101828);
                font-family: Nunito;
                font-size: var(--Title-Medium-Size, 16px);
                font-style: normal;
                font-weight: 500;
                line-height: var(--Title-Medium-Line-Height, 24px); /* 150% */
                letter-spacing: var(--Title-Medium-Tracking, 0.15px);
            }

        }
        .days{
            padding: 15rpx;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #EAECF0;
            .dayitem{
                text-align: center; 
                width: 90rpx;
                height: 90rpx;
                
                .day{
                    padding-top: 3rpx;
                    color: var(--Color, #141414);
                    text-align: center;
                    font-family: Nunito;
                    font-size: 15px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    letter-spacing: -0.3px;
                }
                .weekdayday{
                    color: #838383; 
                    text-align: center;
                    font-family: Nunito;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.24px;
                }
                .item{
                    border-radius: 20rpx;
                    border:1px solid #F1F1F1;
                    padding-bottom: 5rpx;
                }
                .activeday{
                    background-color: #EFC462;
                    color: white;
                    .weekdayday, .day{
                        color: white;

                    }
                }
            }
        }
     }
</style>
