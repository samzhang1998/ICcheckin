<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Attendance Setting</text> 
        </view> 
        <view class="content">
            <view class="userinfo">
                <view class="name">Time Setting</view>
                <view class="position">Setting checkin and checkout time</view>                 
            </view> 
            <view class="item">
                <view class="itemtitle">Star Time</view>
                <view class="itemcontents">  
                    <picker mode="time" :value="timedata.startTime" style="width: 500rpx;" @change="bindStartPickerChange">
						<view class="uni-input userinput">{{timedata.startTime}}</view>
					</picker>                    
                </view>
            </view>  
            <view class="item">
                <view class="itemtitle">End Time</view>
                <view class="itemcontents"> 
                    <picker mode="time" :value="timedata.endTime" style="width: 500rpx;" @change="bindPickerChange">
						<view class="uni-input userinput">{{timedata.endTime}}</view>
					</picker>                     
                </view>
            </view>  
        </view>
        <view class="vbtm">
            <view class="btn" @click="update">Update</view>
        </view> 
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0">
            <view class="popup-content">
                <view class="sub_title">Confirm Manager Setting</view>
                <view class="content2">Once you confirm, Shuoqi Wang will be set as Manager</view>
                <view class="btn" @click="confirm" >Yes</view>
                <view class="btn btn-white" @click="close" >No, Let me check</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupconfirmed"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0">
            <view class="popup-content">
                <view class="sub_title">Confirmed</view>
                <view class="content2">Shuoqi Wang has been setup as manager</view>
                <view class="btn" @click="closeConfirm" >Done</view>
                 
            </view>
        </uni-popup>


	</view>
</template>
  
<script>
import { getTimeApi,updateTimeApi } from "@/api/times";
	export default {
        data() {
            return { 
               timedata:   {
                    timeId:"",
                    startTime:"23",
                    endTime:"24 Feb 2025", 
                }  
            };
        },
		methods: { 
            bindStartPickerChange: function(e) { 
                this.timedata.startTime =  e.detail.value + ":00"
            },
            bindPickerChange: function(e) { 
                this.timedata.endTime =  e.detail.value + ":00"
            },
            getTime(){
                getTimeApi().then((res)=>{
                    console.log(res)
                    this.timedata = res.data
                })
            },
            back(){
                uni.navigateBack({
                    delta: 1
                });
            }, 
            save(){
                this.$refs.popup.open("bottom")
            },
            update(){   
                let data={
                   
                    endTime  : this.timedata.endTime ,
                    startTime : this.timedata.startTime,
                }
                updateTimeApi(data, data).then((res)=>{
                    console.log(res)
                    uni.showToast({
                        title: "Saved",
                        icon: "success",
                        duration: 3000,
                    });
                    uni.navigateBack({
                        delta: 1
                    });
                })
                
            },
            close(){
                this.$refs.popup.close()
            },
            confirm(){
                this.$refs.popup.close()
                this.$refs.popupconfirmed.open("bottom")
            },
            closeConfirm(){
                this.$refs.popupconfirmed.close()
            }
		},
        mounted() { 
            this.getTime()
        }, 
	}
</script>
  
<style scoped lang="scss">
	.maindiv{ 
        width: 750rpx;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background-color: #F8F8F8;
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
        .popup-content{
            height: 260rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white; 
            padding: 60rpx;
            text-align: center;
            .sub_title{
                color: #000;
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: var(--Body-Small-Line-Height, 16px); /* 80% */
                letter-spacing: -0.2px;
            }
            .content2{
                color: #838383;
                text-align: center;
                font-family: Nunito;
                font-size: 13px;
                font-style: normal;
                font-weight: 500;
                line-height: 130%; /* 16.9px */
                margin-top: 10rpx;
            }
            .btn{  
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 630rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
            .btn-white{
                background: white;
                color:#EFC462;
                border: 1px solid #EFC462;
            }
        }
        .vbtm{
            position: fixed;
            bottom: 0;
            width: 750rpx;
            height: 150rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #E9EAEC;
            background: #FEFEFE;
            .btn{ 
                display: flex;
                width: 675rpx;
                height: 85rpx;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 100px;
                border: none;
                background: #EFC462;
                color: #fff;
                text-align: center;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
        }
        .content{
            width: 600rpx;
            padding:30rpx 40rpx;
            border-radius: 10px;
            background: #FFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30rpx;
        }
        .item{
            width: 600rpx;
            display: flex;
            flex-direction: column;
            gap: 10rpx;
            .itemtitle{
                color: #475467;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            .itemcontents{
                width: 560rpx;
                padding: 10rpx 20rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-radius: 10px; 
                border: 1px solid #DADADA;
                background: #FFF;
                gap: 20rpx;
                .userinput{
                    height: 50rpx;
                    color: #141414;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    letter-spacing: 0.25px;
                }
            }
        }
        .userinfo{
            width: 600rpx;
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: #667085;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 140%;
            }
        }
    }
</style>
