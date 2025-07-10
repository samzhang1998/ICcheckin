<template>
	<view class="maindiv">
        <view class="header" :style="{ paddingTop: safeAreaHeight  + 'px' }"> 
            <image v-if="userinfo.permEvent" src="/static/jia.png" @click="add" class="icon" alt="logo" />
        </view>

         <uni-calendar 
            :insert="true"
            :lunar="false"  
            :selected="selected"
            @change="selectDay"
            @monthSwitch="changemonth"
	    />
        <view class="subtitle">Upcoming Event</view>
        <view class="event" v-for="(item, index) in comevents" :key="index" @click="gotoevent(item)">
            <view class="flex line1">
               <view class="eventtitle">{{ item.title }}</view>
               <view class="eventrepeat">({{ item.repeat.description }})</view>
            </view> 
            <view class="flex">
                <view class="date">{{ item.date.substring(8, item.date.length )}} {{ item.date.substring(5, item.date.length-3)|getMonthAbbr }} , </view>
                <view class="range">{{ item.startTime }}-{{ item.endTime }}</view>
            </view>
            <view class="flex flexlocation">
                <view class="location">{{ item.location }}</view>
                <view class="user">{{ item.creatorFirstName[0].toUpperCase() }}{{ item.creatorLastName[0].toUpperCase() }}</view>
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
               userinfo:{},
               activeday:  new Date(), 
               showeventids:[],
               safeAreaHeight: 150,
               currentday:null,
               comevents:[],
               selected:[],
               events:[  ],
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
        filters:{
            getMonthAbbr(monthInput) {
                const monthNum = parseInt(monthInput, 10);
                const monthAbbrs = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];
                
                if (monthNum >= 1 && monthNum <= 12) {
                    return monthAbbrs[monthNum - 1];
                }
                return 'Invalid Month';
            }  
        },
		methods: { 
            cancelLeaveRequest(){
                this.eventRequest = false 
            },
            gotoevent(item){
                uni.navigateTo({
                    url: '/pages/calendar/detail?event=' + JSON.stringify(item) // 目标页面的路径
                }); 
            },
            selectDay(e){ 
                uni.navigateTo({
                    url: '/pages/calendar/index?date=' + e.fulldate // 目标页面的路径
                }); 
            },
            getFirstAndLastDayFormatted(date) {
                const year = date.getFullYear();
                const month = date.getMonth();

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);

                // 格式化日期为 YYYY-MM-DD
                const format = d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

                return {
                    firstDay: format(firstDay),
                    lastDay: format(lastDay)
                };
            },
            changemonth(e){ 
                let today = new Date(e.year, e.month-1, 10) 
                let dates = this.getFirstAndLastDayFormatted(today) 
                this.getEvents(dates.firstDay, dates.lastDay, "all")
            },
            add(){
                this.eventRequest = true
            },
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
            getTomorrowFormatted() {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow.toISOString().split('T')[0];
            },
            getComingEvents(){
                let today = new Date()
                let year = today.getFullYear()
                let month = today.getMonth() + 1
                let day = today.getDate()
                if (day < 10) {
                    day = "0" + day
                }
                if (month < 10) {
                    month = "0" + month
                }
                let params = {
                    startDate: year + "-" + month + "-" + day,
                    endDate: this.getTomorrowFormatted()
                }
                
                this.getEvents(year + "-" + month + "-" + day, this.getTomorrowFormatted(), "comming")
            },
            getMonthEvents(){
                let dates = this.getFirstAndLastDayFormatted(this.currentday)
                this.getEvents(dates.firstDay, dates.lastDay, "all")
            },
            getEvents(startDate, endDate, eventtype){ 
                let params={
                    startDate:startDate,
                    endDate:endDate
                }  
                getEventListApi(params).then((res)=>{ 
                    if(res.status ==1){
                        if (eventtype == "comming"){
                            this.comevents = res.data
                        }else{
                            this.events = res.data 
                            for(let i = 0; i < this.events.length; i++){
                                let select = {
                                    date:this.events[i].date,
                                    info: this.events[i].title,
                                    ...this.events[i]
                                }
                                this.selected.push(select)
                            }

                        } 
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
             
            changeDay(item){
                this.activeday = item.date 
                this.showeventids = [] 
                this.init_times()
                this.fillEvent()
            }, 
             
            getUserInfo(){
                this.user.token = uni.getStorageSync("token");  
                this.userinfo = uni.getStorageSync("userinfo")
          
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return 
                }
                this.ismanager = false 
                this.userid = uni.getStorageSync("id");  
              
            }
		},
        onShow () {
            this.getComingEvents()
        },
        onLoad() {
            this.getUserInfo()  
            this.currentday = new Date()
            this.getMonthEvents()
            this.systemInfo = uni.getSystemInfoSync(); 
            this.safeAreaHeight = this.systemInfo.statusBarHeight || 150;
            
        },
        
	}
</script>
  
<style scoped lang="scss" src="./month.scss"></style>
