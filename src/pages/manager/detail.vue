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
            <view class="sub_title" >Contact Number</view>
            <view class="txt" @click="call(leaverequest.phoneNumber)">{{leaverequest.phoneNumber}}</view>
            <view class="sub_title" v-if="leaverequest.note">Description</view>
            <view class="txt">{{ leaverequest.note }}</view>
            <view class="sub_title">Leave Status</view>
            <view class="txt" v-if="leaverequest.status == 'PENDING'">{{ leaverequest.status }}  </view>
            <view class="txt" v-else>{{ leaverequest.status }} by {{ leaverequest.admin }}</view>
            <view v-if="leaverequest.adminComment" class="comments">
                <view class="sub_title">Admin Comments</view>            
                <view class="txt">{{ leaverequest.adminComment }}</view>
            </view>                      
        </view>
        <view class="vbtm" v-if="allowCancel">
            <view class="btn_cancel" @click="cancel">Cancel this request</view>
        </view>
        <view class="vbtm" v-if="leaverequest.status === 'PENDING' && canedit">
            <view class="btn success" @click="Approve"><image src="/static/r.png" class="btnimg"></image>  Approve</view>
            <view class="btn error" @click="Reject"><image src="/static/close.png" class="btnimg"></image>  Reject</view>
        </view>
        <view class="vbtm" v-if="leaverequest.status === 'WAITING_CANCELLATION_CONFIRMATION' && canedit">
            <view class="btn success" @click="ApproveCancel"><image src="/static/r.png" class="btnimg"></image>  Approve</view>
            <view class="btn error" @click="RejectCancel"><image src="/static/close.png" class="btnimg"></image> Reject</view>
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
    import {leaveApprovalApi, remoteApprovalApi, cancelLeaveRequest, specificLeave} from "@/api/leave";
    import { leaveView } from "@/api/admin";
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
            call(phone){
                uni.makePhoneCall({
                    phoneNumber: phone  
                });
            },
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
                    "approve": approve,
                    "comment": this.comments, 
                }
                 
                remoteApprovalApi( [this.leaverequest.requestId], data).then((res)=>{
                    
                    if (res.status ==1){
                        this.$refs.popup.open("bottom") 
                    }else{
                        uni.showModal({
                            title:"Failed",
                            content: res.msg,
                            confirmText: "OK",
                            showCancel: false
                        });
                    } 
                })
                
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
                    const res = await leaveView(this.leaverequest.requestId, data);
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
            async getLeaveInfo () {
                const request = uni.getStorageSync("thisRequest");
                try {
                    const res = await specificLeave(request); 
                    if (res.statusCode === 200) {
                        this.leaverequest = res.data.data;
                        console.log("leave:", this.leaverequest);
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to get leave info", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of getting leave info", icon: "none" });
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
        onShow () { 
            const role = uni.getStorageSync("role");
            const id = uni.getStorageSync("id");
            if (role[0] === "EMPLOYEE" && (this.leaverequest.status === "APPROVED" || this.leaverequest.status == "APPROVED")) {
                this.allowCancel = true
            } else if (role[0] === "MANAGER" && this.leaverequest.status === "APPROVED" && id === this.leaverequest.userId) {
                this.allowCancel = true
            } else {
                this.allowCancel = false
            };
            if (role[0] === "ADMIN") {
                this.canedit = true
            } else {
                this.canedit = false
            }
        },
        onLoad (options) { 
            if (options.data){
                this.leaverequest = JSON.parse(options.data); 
                if (this.leaverequest) {
                    console.log(this.leaverequest);
                } else {
                    this.getLeaveInfo();
                    console.log(this.leaverequest);
                }
                this.userid =  uni.getStorageSync("id");
                console.log(this.userid)

            } else{
                this.getLeaveInfo();
            }       
            
        }        
	}
</script>
  
<style scoped lang="scss" src="./detail.scss">
	
</style>
