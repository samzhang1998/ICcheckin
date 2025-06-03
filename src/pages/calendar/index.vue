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
            <view class="timeitem"  v-for="(time,time_index) in times" :key="time_index">
                <view class="lable"  v-if="time.time<12">{{ time.time}} am</view>
                <view class="lable"  v-if="time.time==12">Midday</view>
                <view class="lable"  v-if="time.time>12">{{ time.time}} pm</view>
                <view class="event"  >
                    <view   v-for="(event, index) in time.events" :key="index">
                        <view class="activeevent "  @click="gotoEvent(event.eventId)">
                            <view class="left"   >
                                <view class="name">{{ event.title }} </view>
                                <view class="noee">{{ event.description }}</view>
                            </view>
                            <view class="right"  >
                                {{ event.userName }}
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
               showeventids:[],
               events:[
                {
                    activetime:6,
                    title:"SEO Meeting with Lee Massage",
                    description:"note",
                    userName:"Shuoqi Wang"
                }
               ],
               userid:"",
               user:{},
               times:[
                {
                    time:1,
                    events:[]
                },
               ]
            };
        },
        watch: { 
			activeday: {
				handler(newVal) { 
				}
			}
		},
		methods: {
            gotoEvent(eventID){
                let event = {}
                this.events.map((item)=>{
                    if (item.eventId == eventID){
                        uni.navigateTo({
                            url: '/pages/calendar/detail?event='+JSON.stringify(item) // 目标页面的路径
                        });
                        
                        return 
                    }
                })
            },
            init_times(){
                this.times=[
                {
                    time:0,
                    events:[ ]
                },
               ]
                for(let i = 1 ; i < 24; i ++){
                    this.times.push({
                        time:i,
                        events:[]
                    })

                }
            },
            fillEvent(){
                if(this.activeday != null){
                    let month = this.activeday.getMonth() + 1
                    if (month < 10){
                        month = "0"+ month
                    }
                    let year = this.activeday.getFullYear()
                    let day = this.activeday.getDate()
                    if (day < 10){
                        day = "0"+day
                    }
                    
                    //
                    this.events.map((event)=>{  
                        this.times.map((time)=>{
                            let current_hour = time.time
                            let next_hour = time.time + 1 
                            if (current_hour < 10){
                                current_hour = "0"+current_hour
                            }

                            if (next_hour < 10){
                                next_hour = "0"+next_hour
                            }

                            let sttt = year+'-'+month+'-' + day+ 'T' + current_hour + ':00:00' 
                            let current_time = new Date(sttt) // 当前小时

                            let next_hour_str = year+'-'+month+'-' + day+ 'T' + next_hour + ':00:00' 
                            let next_time = new Date(next_hour_str)// 下一小时

                            
                            if (current_time.getTime() <= event.startTime.getTime() && next_time.getTime() >  event.startTime.getTime() )
                            {
                                 
                                // 如果开始时间落入小时范围（当前小时， 下一小时），则赋值事件以及详细信息， 
                                let event2 = {
                                    eventId:event.eventId,
                                    title:event.title,
                                    description:event.description,
                                    userName:event.userName
                                }
                                time.events.push(event2) 
                                console.log(time)
                            }else if (current_time.getTime() < event.endTime.getTime() && next_time.getTime() >=  event.endTime.getTime() ){
                                // 如果开始时间没有落入小时范围（当前小时， 下一小时），但结束时间落入了，那则只赋值事件id
                                let event2 = {
                                    eventId:event.eventId,
                                    title:"",
                                    description:"",
                                    userName:""
                                }
                                time.events.push(event2)
                            }else if (current_time.getTime() > event.startTime.getTime() && next_time.getTime() <=  event.endTime.getTime() ){
                                // 如果开始时间<起始小时，并且结束时间大于结束小时，那则只赋值事件id
                               
                                let event2 = {
                                    eventId:event.eventId,
                                    title:"",
                                    description:"",
                                    userName:""
                                }
                                time.events.push(event2)
                            }  
                        })
                    })  
                }
            },
            getEvents(){
                let params={
                    userId:this.userid
                }
                getEventsApi(this.userid,params).then((res)=>{
                    if(res.status ==1){
                        this.events = res.data 
                        for(let i =0; i < this.events.length; i++){ 
                            // 区时问题？
                            this.events[i].startTimeStr =  this.events[i].startTime 
                            this.events[i].endTimeStr =  this.events[i].endTime 
                            this.events[i].startTime = new Date(this.events[i].startTime)
                            this.events[i].endTime = new Date(this.events[i].endTime)
                            
                        } 
                        this.init_times()  
                        this.fillEvent()
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
                    let item = {
                        day:day.getDate(),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days; 
                
                this.activeday = this.weekDays[0].date 
                this.init_times()  
                this.fillEvent()
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
                this.init_times()  
                this.fillEvent()
            },
            changeDay(item){
                this.activeday = item.date 
                this.showeventids = [] 
                this.init_times()
                this.fillEvent()
            }, 
            getWeekDays() {
                const today = new Date(); 
                let startday = new Date(today.setDate(today.getDate() - today.getDay()));
                const days = []; 
                for (let i = 0; i < 7; i++) {
                    const day = new Date(startday); 
                    day.setDate(startday.getDate() + i);
                    let item = {
                        day:day.getDate(),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                }   
                this.activeday =  new Date();   
                console.log(this.activeday)
                this.weekDays = days;  
            },
            getTimeDate(time, event){
                if (time == 24){
                    return false
                }

                let month = this.activeday.getMonth() + 1
                if (month < 10){
                    month = "0"+ month
                }
                let nexttine = time + 1
                if (time < 10){
                    time = "0"+ time
                }
                if (nexttine < 10){
                    nexttine = "0"+ nexttine
                }
                let sttt = this.activeday.getFullYear()+'-'+month+'-' + this.activeday.getDate() + 'T' + time + ':00:00'
               
                let current_start_time = new Date(sttt)
                
                let end = this.activeday.getFullYear()+'-'+month+'-' + this.activeday.getDate() + 'T' + nexttine + ':00:00'
               
                let current_end_time = new Date(end) 
                if (current_start_time.getTime() >= event.startTime.getTime() && current_end_time.getTime() >=  event.endTime.getTime() )
                { 
                    return true
                }else{
                     
                    return false
                }
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
            
        },
        onLoad() {
            this.getUserInfo()  
            
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
            height: 150rpx;
            padding: 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: end;          
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
                    background-color: #01aed3;
                    color: white;
                    .weekdayday, .day{
                        color: white;

                    }
                }
            }
        }
     }
</style>
