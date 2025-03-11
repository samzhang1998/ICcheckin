<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="back"/>
            <view class="title">Attendance Setting</view> 
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

        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Confirm Manager Setting</view>
                <view class="content2">Once you confirm, Shuoqi Wang will be set as Manager</view>
                <view class="btn" @click="confirm" >Yes</view>
                <view class="btn btn-white" @click="close" >No, Let me check</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupconfirmed"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Confirmed</view>
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
                    this.timedata = res
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
                updateTimeApi(data).then((res)=>{
                    console.log(res)
                    uni.showToast({
                        title: "Saved",
                        icon: "success",
                        duration: 3000,
                    });
                    uni.navigateTo({
                        url: '/pages/manager/profile'  
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
        min-height:80vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .popup-content{
            height: 260rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white; 
            padding: 60rpx;
            text-align: center;
            .title{
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
            height: 154rpx;
            width:750rpx;
            border-top: 1px solid #E9EAEC; 
            background: var(--Color-Surface-Primary, #FEFEFE);
            
            .btn{ 
                margin-left: 35rpx;
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 650rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
        }
        .content{
            min-height: 70vh;
            padding:25rpx;
            border-radius: 8px;
            background: #FFF;
            .action{
                color: #EFC462; 
                font-family: Nunito;
                font-size: 16px;
                font-style: normal; 
                line-height: 20px; /* 125% */
                text-align: center;
                margin-top:30rpx;
            }
            padding-bottom: 220rpx;
        }
        .item{
            margin-top: 20rpx;
            .itemtitle{
                color: var(--Color-Gray-Gray-600, #475467);
                font-family: Nunito;
                font-size: var(--Body-Small-Size, 12px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--Body-Small-Line-Height, 16px); /* 133.333% */
                letter-spacing: -0.2px;
            }
            .itemcontents{
                display: flex;
                border-radius: 8px; 
                border: 1px solid #DADADA;
                background: #FFF;
                margin-top: 20rpx;
                height: 80rpx;
                line-height: 80rpx;
                .userinput{
                    height: 80rpx;
                    line-height: 80rpx;
                    margin-left: 20rpx;
                }
                .imgfloatright{
                    position: absolute;
                    right: 50rpx;
                }
                .itemcontent{  
                    display: flex;
                    margin-top: 20rpx;
                    margin-left: 10rpx;
                }
                .image{ 
                    width: 36rpx;
                    height: 36rpx;  
                    margin-left: 20rpx; 
                    margin-top: 25rpx;
                }
                .msg{ 
                    color: #4F5464;
                    font-family: Nunito;
                    font-size: 14px; 
                    font-style: normal;
                    font-weight: 600; 
                    margin-bottom: 10rpx;
                }
            }
        }
        .userinfo{
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: var(--Color-Gray-Gray-500, #667085);
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%; /* 16.8px */
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
