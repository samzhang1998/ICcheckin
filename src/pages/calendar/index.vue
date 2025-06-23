<template>
	<view class="maindiv">
        <view class="header" >
            <image src="/static/back_icon.png"  @click="back" class="icon" alt="logo" /> 
            <image src="/static/jia.png" @click="add" class="icon" alt="logo" />
        </view>
        <view class="header2">
            <image src="/static/arrowleft.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <text class="title"> {{  activeday.toLocaleDateString('en-US', { month: 'long' })  }} {{ activeday.getFullYear()  }}</text>
            <image src="/static/arrowright.png" alt="logo" class="arrowimg arrowright" @click="nextWeek"/> 
        </view>
        <view class="days">
            <view class="dayitem"  v-for="(item, index) in weekDays" :key="index">
                <div class="item" :class="{activeday: item.day==activeday.getDate()}" @click="changeDay(item)">
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
                        <view class="activeevent "  @click="gotoEvent(event.id)">
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
        <Eventform :eventRequest="eventRequest" @cancelLeaveRequest="cancelLeaveRequest"/>
	</view>
</template>
  
<script>
import { getEventListApi } from "@/api/events";
import Eventform from '@/components/event/eventform.vue';
import Users from '@/components/event/users.vue';
	export default {
        components: {
            Eventform ,
            Users
        },
        data() {
            return {
                eventRequest:false,
               weekDays: [],
               activeday:  null, 
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
                    console.log(newVal)
                     
				}
			}
		},
		methods: {
            cancelLeaveRequest(){
                this.eventRequest = false 
            },
             back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            gotoEvent(eventID){
                let event = {}
                this.events.map((item)=>{
                    if (item.id == eventID){
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
                                    id:event.id,
                                    title:event.title,
                                    description:event.description,
                                    userName:event.creatorLastName
                                }
                                time.events.push(event2)  
                            }else if (current_time.getTime() < event.endTime.getTime() && next_time.getTime() >=  event.endTime.getTime() ){
                                // 如果开始时间没有落入小时范围（当前小时， 下一小时），但结束时间落入了，那则只赋值事件id
                                let event2 = {
                                    id:event.id,
                                    title:"",
                                    description:"",
                                    userName:""
                                }
                                time.events.push(event2)
                            }else if (current_time.getTime() > event.startTime.getTime() && next_time.getTime() <=  event.endTime.getTime() ){
                                // 如果开始时间<起始小时，并且结束时间大于结束小时，那则只赋值事件id
                               
                                let event2 = {
                                    id:event.id,
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
                    startDate:this.weekDays[0].datestr ,
                    endDate:this.weekDays[6].datestr 
                }   
                getEventListApi( params).then((res)=>{ 
                    if(res.status ==1){
                        this.events = res.data 
                        for(let i =0; i < this.events.length; i++){ 
                            // 区时问题？
                            this.events[i].startTimeStr =  this.events[i].startTime 
                            this.events[i].endTimeStr =  this.events[i].endTime 
                            this.events[i].startTime = new Date(this.events[i].date +" "+ this.events[i].startTime)
                            this.events[i].endTime = new Date(this.events[i].date +" "+this.events[i].endTime)
                            
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
                        datestr:this.getDatestr(day),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days;  
                this.activeday = this.weekDays[0].date 
                this.getEvents()   
            },
            preWeek(){
                let lastday = this.weekDays[0].date 
                
                let days = []
                for (let i = 1; i < 8; i++) { 
                    const day = new Date(lastday);
                    day.setDate(day.getDate() - i);
                    let item = {
                        day:day.getDate(),
                        datestr:this.getDatestr(day),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                } 
                this.weekDays = days.reverse();   
                this.activeday = this.weekDays[0].date   
                this.getEvents()
            },
            changeDay(item){ 
                this.activeday = item.date 
                this.showeventids = [] 
                this.init_times()
                this.fillEvent()
            }, 
            getWeekDays() {
                let today = new Date(this.getDatestr(this.activeday));  
                let startday = new Date(today.setDate(today.getDate() - today.getDay()));
                const days = []; 
                for (let i = 0; i < 7; i++) {
                    let day = new Date(startday); 
                    day.setDate(startday.getDate() + i);
                    let item = {
                        day:day.getDate(),
                        datestr:this.getDatestr(day),
                        weekday:day.toDateString()[0],
                        date:day,
                    } 
                    days.push(item);
                }     
                this.weekDays = days;  
            },
            getDatestr(date){
                let month = date.getMonth() + 1
                if (month < 10){
                    month = "0"+ month
                } 

                let day = date.getDate()  
                if (day < 10){
                    day = "0"+ day
                } 

                let year = date.getFullYear()  
                return year +"-" + month + "-" + day
            }, 
            add(){
                this.eventRequest = true
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
                 
            }
		},
        onShow () {
            
        },
        onLoad(options) { 
            let date = options.date 
            this.activeday = new Date(date) 
            this.getWeekDays()
            this.getUserInfo()  
            this.getEvents() 
        },
        
	}
</script>
  
<style scoped lang="scss" src="./index.scss">
	
</style>
