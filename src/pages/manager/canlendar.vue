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
          <view class="day">  
            {{activeday.toLocaleDateString('en-US', { weekday: 'long' }) }} - {{ activeday.getDate() }} {{  activeday.toLocaleDateString('en-US', { month: 'short' })  }} {{ activeday.getFullYear()  }}
          </view>
          <view class="action">
            +Add
          </view>
        </view>
        <view class="times">
            <view class="timeitem" v-for="time in 12" :key="time" >
                <view class="lable">{{ time}} am</view>
                <view class="event"  >
                    <view   v-for="(event, index) in events" :key="index">
                        <view class="vflex " v-if="time == event.activetime">
                            <view class="activeevent" :class="'activeevent'+(timeindex+1)" v-for="(item2, timeindex) in event.items" :key="timeindex">
                                <view class="left">
                                    <view class="name">{{ item2.name }} </view>
                                    <view class="noee">{{ item2.note }}</view>
                                </view>
                                <view class="right">
                                    {{ item2.righttxt }}
                                </view>
                            </view>
                        </view>
                    </view> 
                </view>
            </view>
            <view class="timeitem"  >
                <view class="lable">Midday</view>
                <view class="event"  >
                    <view   v-for="(event, index) in events" :key="index">
                        <view class="vflex " v-if="12 == event.activetime">
                            <view class="activeevent" :style="colors[timeindex]" v-for="(item2, timeindex) in event.items" :key="timeindex">
                                <view class="left">
                                    <view class="name">{{ item2.name }} </view>
                                    <view class="noee">{{ item2.note }}</view>
                                </view>
                                <view class="right">
                                    {{ item2.righttxt }}
                                </view>
                            </view>
                        </view>
                    </view> 
                </view>
            </view>
            <view class="timeitem" v-for="time in 12" :key="time" >
                <view class="lable">{{ time + 13}} pm</view>
                <view class="event"  >
                    <view   v-for="(event, index) in events" :key="index">
                        <view  class="vflex"    v-if="(time + 13) == event.activetime">
                            <view class="activeevent" :style="colors[timeindex]" v-for="(item2, timeindex) in event.items" :key="timeindex">
                                <view class="left">
                                    <view class="name">{{ item2.name }} </view>
                                    <view class="noee">{{ item2.note }}</view>
                                </view>
                                <view class="right">
                                    {{ item2.righttxt }}
                                </view>
                            </view>
                        </view>
                    </view> 
                </view>
            </view>
        </view>
	</view>
</template>
  
<script>
	export default {
        data() {
            return {
               weekDays: [],
               activeday:  new Date(),  
               events:[
                {
                    activetime:6,
                    items:[
                        {
                            name:"SEO Meeting with Lee Massage",
                            note:"note",
                            righttxt:"Zoey" 
                        },
                        {
                            name:"Financial Meeting",
                            note:"Notes",
                            righttxt:"Mia" 
                        }
                    ]
                    
                }
               ]
            };
        },
		methods: {
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
            }
		},
        mounted() {
            this.getWeekDays();
        },
        
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{
        .times{
            padding: 15rpx;
            .timeitem{
                display: flex;
                .vflex{
                    display: flex;
                }
                .activeevent1{
                    background-color:rgba(239, 196, 98, 0.20);
                    border-left:2px solid #EFC462
                }
                .activeevent2{
                    background-color:rgba(82, 178, 230, 0.20);;
                    border-left:2px solid #52B2E6
                }
                .activeevent{
                    display: flex;
                    justify-content: space-between;
                    height: 80rpx;
                    padding-left: 10rpx;
                    padding-right: 10rpx; 
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
                            white-space: nowrap;      /* 禁止换行 */
                            overflow: hidden;         /* 隐藏溢出内容 */
                            text-overflow: ellipsis;  /* 显示省略号 */
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
            border-bottom: 1px solid #CDCDCD;
            display: flex;
            justify-content: space-between;
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
