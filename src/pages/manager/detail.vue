<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <view class="title"> Leave Review</view> 
        </view> 
        <view class="content">
            <view class="title">Employee </view>
            <view class="txt">{{ leaverequest.user }}</view>
            <view class="title">Leave Category</view>
            <view class="txt">Personal Leave</view>  
            <view class="title">Leave Duration</view> 
            <view class="txt">{{leaverequest.startTime}} -{{leaverequest.endTime}}</view>
            <view class="title">Contact Number</view>
            <view class="txt">{{leaverequest.phoneNumber}}</view> 
            <view class="title">Description</view>
            <view class="txt">{{ leaverequest.note }}</view> 
        </view>

        <view class="vbtm" v-if="leaverequest.status=='PENDING'">
            <view class="btn success" @click="Approve">Approve</view>
            <view class="btn error" @click="Reject">Reject</view>
        </view> 
        <uni-popup ref="popupconfirm"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Leave {{ status }}</view>
                <textarea v-model="comments" class="commets"  placeholder="comments.."> </textarea>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirm" >Cancel</view>
                    <view class="btn btn-confirm" @click="confirm" >Confirm</view> 
                </view>
                
            </view>
        </uni-popup>
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Leave Approved</view>
                <view class="content">You have approved the leave submitted  by {{ leaverequest.user }}</view>
                <view class="btn" @click="close" >Done</view>
            </view>
        </uni-popup>
	</view>
</template>
  
<script>

	
    import {leaveApprovalApi} from "@/api/leave";
	export default {
        data() {
            return { 
                status:"",
                comments:"",
                leaverequest:   {
                    activetime:6,
                    name:"SEO Meeting with Lee Massage",
                    date:"24 Feb 2025",
                    time:"3pm - 4pm",
                    note:"note",
                    righttxt:"Shuoqi Wang"
                },
                
                userid:""
            };
        },
		methods: {
            
            preWeek(){
                uni.navigateBack({
                    delta: 1
                });
            },
            confirm(){
                console.log(this.comments)
                let approve = false
                if( this.status == "Approve"){
                    approve = true
                }
                let data = { 
                    "requestId": this.leaverequest.requestId,
                    "approve": approve,
                    "comment": this.comments,
                    "adminId": this.userid 
                }
                leaveApprovalApi(data).then((res)=>{
                    console.log(res)
                    this.$refs.popup.open("bottom") 
                }) 
            },
            closeConfirm(){
                this.$refs.popupconfirm.close() 
            },
            Reject (){
                this.status = "Reject"
                this.$refs.popupconfirm.open("bottom")
            },
            Approve(){
                this.status = "Approve"
                this.$refs.popupconfirm.open("bottom")
            },
            close(){
                this.$refs.popup.close()
                this.preWeek()
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
                this.user.email = uni.getStorageSync("email");  
                this.userid = uni.getStorageSync("id");  
                this.user.lastName = uni.getStorageSync("lastName");  
                this.user.firstName = uni.getStorageSync("firstName");  
                this.user.phone = uni.getStorageSync("phone");  

                this.user.department = uni.getStorageSync("department");  
                this.user.title = uni.getStorageSync("title");  
                this.user.role = uni.getStorageSync("role");   
                 
            }
		},
        onShow() { 
            
        },
        onLoad(options) {
            this.getUserInfo()
            console.log(options)
            this.leaverequest = JSON.parse(options.request) 
        },
        
	}
</script>
  
<style scoped lang="scss">

	 .maindiv{ 
        min-height: 100vh;
        
        background-color: #F8F8F8;
        .popup-content{
            height: 240rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white; 
            padding: 60rpx;
            text-align: center;
            .btns{
                display: flex;
                margin-bottom: 60rpx;
                .btn{
                    width: 300rpx;
                }
                .btn-cancel{
                    margin-right: 10rpx;
                    border: 1px solid #838383;
                    background-color: white;
                    color:#000;
                }
            }
            .commets{
                margin-top: 20rpx;
                border-radius: 25rpx;
                height: 160rpx;
                overflow: scroll;
                border: 1px solid #838383;
                text-align: left;
                padding:10rpx;
            }
            .title{
                color: #000;
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: var(--Body-Small-Line-Height, 16px); /* 80% */
                letter-spacing: -0.2px;
            }
            .content{
                color: #838383;
                text-align: center;
                font-family: Nunito;
                font-size: 13px;
                font-style: normal;
                font-weight: 500;
                line-height: 130%; /* 16.9px */
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
        }
        .content{
            margin:15rpx;
            padding: 25rpx; 
            border-radius: 8px;
            background-color: white;
            .title{
                color: #000;
                font-family: Nunito;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 140%; /* 19.6px */
                margin-top: 25rpx;
            }

            .txt{
                color: var(--Color-Gray-Gray-500, #667085);
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%; /* 16.8px */
            }
        }
        .vbtm{
            position: fixed;
            bottom: 0;
            height: 154rpx;
            width:750rpx;
            border-top: 1px solid #E9EAEC; 
            background: var(--Color-Surface-Primary, #FEFEFE);
            display: flex;
            justify-content: center; 
            padding-right: 20rpx;
            .btn{  
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 300rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
            .success{
                margin-right: 20rpx;
                background-color: #1A8E05;
            }
            .error{
                background-color: #EE4343;
            }
        }
        .header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx; 
            height: 80rpx;;
            background-color: white;
            padding:15rpx;
            border-bottom: 1px solid var(--Color-Gray-Gray-200, #EAECF0);
            padding-top: 30rpx;
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
                line-height: 70rpx;
            }

        } 
     }
 
</style>
