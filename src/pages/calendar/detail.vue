<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek"/>
            <text> Request Details</text> 
        </view> 
        <view class="content">
            <view class="name">{{ event.title }}</view>
            <view class="date">Date</view>
            <text>
                {{ event.date.getDate() }} {{  event.date.toLocaleDateString('en-US', { month: 'short' })  }} {{ event.date.getFullYear()  }}
            </text>
            <view class="time">Time</view>
            <text>{{ event.time }}</text>
            <view class="notes">Notes</view>
            <text>{{ event.description }}</text>
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
        width: 750rpx;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #F8F8F8;
        .content{
            width: 600rpx;
            padding: 30rpx 40rpx;
            border-radius: 10px;
            background-color: white;
            margin-top: 30rpx;
            .date, .time , .notes{
                margin-top: 20rpx;;
                color: #838383; 
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
            .name{
                color: #000; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
            text {
                color: #000; 
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .title {
            width: 750rpx;
            height: 150rpx;
            padding-bottom: 30rpx;
            background: #fff;
            display: flex;
            align-items: end;
            justify-content: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .title image {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            left: 40rpx;
        }
        .title text {
            color: #101828;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
    }
</style>
