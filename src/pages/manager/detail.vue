<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek"/>
            <text> Leave Review</text> 
        </view> 
        <view class="content">
            <view class="sub_title">Name</view>
            <view class="txt">{{ leaverequest.user }}</view>
            <view class="sub_title">Leave Category</view>
            <view class="txt">{{ leaverequest.requestType }}</view>  
            <view class="sub_title">Leave Duration</view> 
            <view class="txt">{{leaverequest.startTime}} -{{leaverequest.endTime}}</view>
            <view class="sub_title">Contact Number</view>
            <view class="txt">{{leaverequest.phoneNumber}}</view>
            <view class="sub_title">Description</view>
            <view class="txt">{{ leaverequest.note }}</view>
            <view class="sub_title">Leave Status</view>
            <view class="txt">{{ leaverequest.status }}</view>
            <view v-if="leaverequest.adminComment" class="comments">
                <view class="sub_title">Admin Comments</view>            
                <view class="txt">{{ leaverequest.adminComment }}</view>
            </view>                      
        </view>
        <view class="vbtm" v-if="allowCancel">
            <view class="btn_cancel" @click="cancel">Cancel this request</view>
        </view>
        <view class="vbtm" v-if="leaverequest.status === 'PENDING' && canedit">
            <view class="btn success" @click="Approve">Approve</view>
            <view class="btn error" @click="Reject">Reject</view>
        </view>
        <view class="vbtm" v-if="leaverequest.status === 'WAITING_CANCELLATION_CONFIRMATION' && canedit">
            <view class="btn success" @click="ApproveCancel">Approve</view>
            <view class="btn error" @click="RejectCancel">Reject</view>
        </view>
        <uni-popup ref="popupconfirm"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Leave {{ viewStatus }}</view>
                <textarea v-model="comments" class="commets"  placeholder="comments.."> </textarea>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirm" >Cancel</view>
                    <view class="btn btn-confirm" @click="confirm" >Confirm</view> 
                </view>                
            </view>
        </uni-popup>
        <uni-popup ref="popupcancel"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Leave Cancel</view>
                <text>Do you want to cancel this request?</text>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeCancel" >Cancel</view>
                    <view class="btn btn-confirm" @click="confirmCancel" >Confirm</view> 
                </view>                
            </view>
        </uni-popup>
        <uni-popup ref="popupconfirmcancel"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Cancellation {{ viewStatus }}</view>
                <textarea v-model="comments" class="commets"  placeholder="comments.."> </textarea>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirmCancel" >Cancel</view>
                    <view class="btn btn-confirm" @click="confirmConfirmCancel" >Confirm</view> 
                </view>                
            </view>
        </uni-popup>
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Leave {{ viewStatus }}</view>
                <view class="content">You have {{ viewStatus }} the leave submitted  by {{ leaverequest.user }}</view>
                <view class="btn" @click="close" >Done</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupsuccess"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Request Submitted</view>
                <view class="content">Your leave cancellation request has been sent for review!</view>
                <view class="btn" @click="closeSuccess" >Done</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupprocess"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Cancellation {{ viewStatus }}</view>
                <view class="content">You have {{ viewStatus }} the cancellation submitted  by {{ leaverequest.user }}</view>
                <view class="btn" @click="closeProcess" >Done</view>
            </view>
        </uni-popup>
	</view>
</template>
  
<script>	
    import {leaveApprovalApi, remoteApprovalApi, cancelLeaveRequest} from "@/api/leave";
    import { reviewLeaveCancel } from "@/api/admin";
	export default {
        data() {
            return { 
                status:"",
                comments:"",
                leaverequest: {},                
                userid:"",
                canedit: false,
                allowCancel: false         
            };
        },
        computed: {
            viewStatus () {
                if (this.status === "Approve"){
                    return "Approved"
                } else {
                    return "Rejected"
                }
            }
        },
		methods: {            
            preWeek(){
                uni.switchTab({ url: "/pages/leave/leave" });
                uni.removeStorageSync("requestData");
                uni.reLaunch({ url: "/pages/leave/leave" });
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
                if (this.leaverequest.requestType === "REMOTE" || this.leaverequest.requestType === "MEETING") {
                    remoteApprovalApi(data).then((res)=>{
                        console.log(res)
                        this.$refs.popup.open("bottom")
                    })
                } else {
                    leaveApprovalApi(data).then((res)=>{
                        console.log(res)
                        this.$refs.popup.open("bottom") 
                    })
                }
            },
            async confirmCancel () {
                try {
                    const res = await cancelLeaveRequest(this.leaverequest.requestId);
                    if (res.data.status === 1) {
                        console.log("success cancel", res.data);
                        this.$refs.popupsuccess.open("bottom")
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to cancel", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of cancelling", icon: "none" });
                }
            },
            async confirmConfirmCancel () {
                let approve = false
                if( this.status == "Approve"){
                    approve = true
                }
                const data = {
                    approve: approve,
                    comment: this.comments
                }
                try {
                    const res = await reviewLeaveCancel(this.leaverequest.requestId, data);
                    if (res.data.status === 1) {
                        console.log("success processing", res.data);
                        this.$refs.popupprocess.open("bottom")
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to process", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of processing", icon: "none" });
                }
            },
            closeConfirm(){
                this.$refs.popupconfirm.close() 
            },
            closeCancel(){
                this.$refs.popupcancel.close() 
            },
            closeConfirmCancel () {
                this.$refs.popupconfirmcancel.close()
            },
            Reject (){
                this.status = "Reject"
                this.$refs.popupconfirm.open("bottom")
            },
            RejectCancel (){
                this.status = "Reject"
                this.$refs.popupconfirmcancel.open("bottom")
            },
            Approve(){
                this.status = "Approve"
                this.$refs.popupconfirm.open("bottom")
            },
            ApproveCancel(){
                this.status = "Approve"
                this.$refs.popupconfirmcancel.open("bottom")
            },
            cancel () {
                this.$refs.popupcancel.open("bottom")
            },
            close(){
                this.$refs.popup.close()
                uni.switchTab({ url: "/pages/leave/leave" });
                uni.reLaunch({ url: "/pages/leave/leave" });
            },
            closeSuccess() {
                this.$refs.popupsuccess.close()
                uni.switchTab({ url: "/pages/leave/leave" });
                uni.reLaunch({ url: "/pages/leave/leave" });
            },
            closeProcess() {
                this.$refs.popupprocess.close()
                uni.switchTab({ url: "/pages/leave/leave" });
                uni.reLaunch({ url: "/pages/leave/leave" });
            }
		},
        onShow() { 
            const role = uni.getStorageSync("role");
            const id = uni.getStorageSync("id");
            if (role[0] === "EMPLOYEE" && this.leaverequest.status === "APPROVED") {
                this.allowCancel = true
            } else if (role[0] === "MANAGER" && this.leaverequest.status === "APPROVED" && id === this.leaverequest.userId) {
                this.allowCancel = true
            } else {
                this.allowCancel = false
            };
            if (role[0] === "ADMIN") {
                this.canedit = true
            } else if (role[0] === "MANAGER" && this.leaverequest.role[0] === "EMPLOYEE") {
                this.canedit = true
            }
        },
        onLoad() {
            this.leaverequest = uni.getStorageSync("requestData");
            console.log(this.leaverequest);
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
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30rpx;
            padding: 40rpx;
            text-align: center;
            .btns{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 20rpx;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
                .btn{
                    width: 300rpx;
                }
                .btn-cancel{
                    border: 1px solid #838383;
                    background-color: white;
                    color:#000;
                }
            }
            .commets{
                width: 600rpx;
                border-radius: 25rpx;
                height: 160rpx;
                overflow: scroll;
                border: 1px solid #838383;
                text-align: left;
                padding: 30rpx;
            }
            .sub_title{
                color: #000;
                font-family: Nunito;
                font-size: 40rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            .content{
                color: #838383;
                text-align: center;
                font-family: Nunito;
                font-size: 25rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 130%;
            }
            .btn{  
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                height: 85rpx; 
                line-height: 80rpx;
                width: 630rpx;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
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
            margin-top: 30rpx;
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
            .comments {
                width: 600rpx;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: start;
                gap: 10rpx;
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
            gap: 20rpx;
            .btn{  
                height: 85rpx; 
                width: 300rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                border-radius: 100px;
                color:white;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
            .success{
                background-color: #1A8E05;
            }
            .error{
                background-color: #EE4343;
            }
            .btn_cancel {
                height: 85rpx; 
                width: 675rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                border-radius: 100px;
                color:white;
                background: #EFC462;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
        } 
    } 
</style>
