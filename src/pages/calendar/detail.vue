<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <view class="title"> Request Details</view> 
        </view> 
        <view class="content">
            <view class="name">{{ event.title }}</view>
            <view class="date">Date</view>
            <view class="datecontxt">
                {{ event.date.getDate() }} {{  event.date.toLocaleDateString('en-US', { month: 'short' })  }} {{ event.date.getFullYear()  }}
               </view>
            <view class="time">Time</view>
            <view class="timecontxt">{{ event.time }}</view>
            <view class="notes">Notes</view>
            <view class="notecontxt">{{ event.description }}</view>
        </view>
	</view>
</template>
  
<script>
	export default {
        data() {
            return { 
               event:   {
                    activetime:6,
                    title:"SEO Meeting with Lee Massage",
                    date:"24 Feb 2025",
                    time:"3pm - 4pm",
                    description:"note",
                    righttxt:"Shuoqi Wang"
                }
                
            };
        },
		methods: {
            preWeek(){
                uni.navigateBack({
                    delta: 1
                });
            }, 
            formatDate(){
                let date = new Date(this.event.startTimeStr)
                this.event.date = date
                this.event.time  = this.event.startTimeStr.substring(11, 16)
                this.event.time  += "-" + this.event.endTimeStr.substring(11, 16)
                
            }
            
		},
        onLoad(options) { 
            this.event = JSON.parse(options.event) 
            console.log(this.event  )
            this.formatDate()
        }
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .content{
            padding: 15rpx; 
            border-radius: 8px;
            background-color: white;
            .date, .time , .notes{
                margin-top: 20rpx;;
                color: #838383; 
                font-family: Nunito;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

            .name{
                color: #000; 
                font-family: Nunito;
                font-size: 16px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
        }
        .header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
            
            .arrowimg{
                width:60rpx;
                height: 60rpx;
            }
            .title{
                width: 700rpx;
                text-align: center;
                color: #101828; 
                font-family: Nunito;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }

        } 
     }
</style>
