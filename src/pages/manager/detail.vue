<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek"/>
            <text> Leave Review</text> 
        </view> 
        <view class="content">
            <view class="sub_title">Employee </view>
            <view class="txt">{{ leaverequest.user }}</view>
            <view class="sub_title">Leave Category</view>
            <view class="txt">Personal Leave</view>  
            <view class="sub_title">Leave Duration</view> 
            <view class="txt">{{leaverequest.startTime}} -{{leaverequest.endTime}}</view>
            <view class="sub_title">Contact Number</view>
            <view class="txt">{{leaverequest.phoneNumber}}</view> 
            <view class="sub_title">Description</view>
            <view class="txt">{{ leaverequest.note }}</view> 
        </view>

        <view class="vbtm" v-if="leaverequest.status==='PENDING'">
            <view class="btn success" @click="Approve">Approve</view>
            <view class="btn error" @click="Reject">Reject</view>
        </view> 
        <uni-popup ref="popupconfirm"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Leave {{ status }}</view>
                <textarea v-model="comments" class="commets"  placeholder="comments.."> </textarea>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirm" >Cancel</view>
                    <view class="btn btn-confirm" @click="confirm" >Confirm</view> 
                </view>
                
            </view>
        </uni-popup>
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Leave Approved</view>
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
            }
		},
        onShow() { 
            
        },
        onLoad() {            
            this.leaverequest = uni.getStorageSync("requestData");
            console.log(this.leaverequest);
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
        background-color: #F8F8F8;
        .title {
            width: 750rpx;
            height: 200rpx;
            background: #F8F8F8;
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
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
            .sub_title{
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
            width: 600rpx;
            padding: 30rpx 40rpx; 
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;
            gap: 10rpx;
            background-color: white;
            .sub_title {
                color: #000;
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 140%;                
            }
            .txt {
                color: #667085;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 140%;
                margin-bottom: 20rpx;
            }
        }
        .vbtm{
            position: fixed;
            bottom: 0;
            height: 150rpx;
            width: 750rpx;
            border-top: 1px solid #E9EAEC; 
            background: #FEFEFE;
            display: flex;
            justify-content: center; 
            align-items: center;
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
    } 
</style>
