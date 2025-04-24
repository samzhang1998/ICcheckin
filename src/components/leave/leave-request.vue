<template>
    <view v-if="leaveRequest" class="overlay" @click="cancleLeaveRequest">
        <scroll-view class="leave_request" @click.stop scroll-y>            
            <view class="leave_opt"> 
                <text class="title">Request</text> 
                <text class="request_title">Request Type</text>              
                <view class="selection" :class="leaveTypeSelection ? 'active' : ''" @click="showLeaveType">
                    <text>{{ selectedLeaveType ? selectedLeaveType : "Select" }}</text>
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                </view>
                <view v-if="leaveTypeSelection" class="type_menu">
                    <view 
                        v-for="(type, index) in leaveTypes" 
                        :key="index" 
                        class="type"
                        @click="selectType(type)"
                    >
                        {{ type }}
                    </view>
                </view>
                <!-- <text class="request_title">Start date</text>
                <view class="selection">
                    <picker mode="date" :value="selectedStartDate" @change="onStartChange">                      
                        <text>{{ selectedStartDate || "Select" }}</text>
                    </picker>
                    <picker mode="date" :value="selectedStartDate" @change="onStartChange">                    
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view> -->
                <text class="request_title">Start Time</text> 
                <uni-datetime-picker :hide-second="true" type="datetime" placeholder="Select start time" return-type="string" v-model="selectedStartValue" />
               
                <!-- <text class="request_title">Start Time</text>
                <view class="selection">
                    <picker mode="time" :value="selectedStartTime" @change="onStartTimeChange">
                        <text>{{ selectedStartTime || "Select" }}</text>
                    </picker>
                    <picker mode="time" :value="selectedStartTime" @change="onStartTimeChange">
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view> -->
                <!-- <text class="request_title">End date</text>
                <view class="selection">
                    <picker mode="date" :value="selectedEndDate" @change="onEndChange">                      
                        <text>{{ selectedEndDate || "Select" }}</text>
                    </picker>
                    <picker mode="date" :value="selectedEndDate" @change="onEndChange">
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view>
                <text class="request_title">End Time</text>
                <view class="selection">
                    <picker mode="time" :value="selectedEndTime" @change="onEndTimeChange">
                        <text>{{ selectedEndTime || "Select" }}</text>
                    </picker>
                    <picker mode="time" :value="selectedEndTime" @change="onEndTimeChange">                    
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view> -->
                <text class="request_title">End Time</text>
                <uni-datetime-picker :hide-second="true" type="datetime" placeholder="Select end time" return-type="string" v-model="selectedEndValue" /> 
                 
                <text class="request_title">Leave Description</text>
                <textarea v-model="note" placeholder="Enter Leave Description"></textarea>
            </view>            
            <button @click="handleSubmit">Submit Leave</button>
        </scroll-view>        
    </view>
</template>

<script>
    import { sendLeaveRequest, sendRemoteRequest } from '@/api/leave';
    export default {
        name: "LeaveRequest",
        props: {
            leaveRequest: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                leaveTypeSelection: false,
                selectedLeaveType: "",
                selectedStartDate: "",
                selectedStartTime: "",
                selectedEndDate: "",
                selectedEndTime: "",
                startDateValue: Date.now(),
                showStartDate: false,
                endDateValue: Date.now(),
                showEndDate: false,
                note: "",
                selectedEndValue:"",
                selectedStartValue:"",
                leaveTypes: [
                    "ANNUAL",
                    "SICK",
                    "REMOTE",
                    "MEETING",
                    "OUTSIDE",
                    "OTHER"
                ]
            }
        },
        computed: {
             
        },
        methods: {
            cancleLeaveRequest () {
                this.$emit("cancelLeaveRequest");
                this.selectedLeaveType = "";
                this.leaveTypeSelection = false;
            },
            showLeaveType () {
                this.leaveTypeSelection = !this.leaveTypeSelection;
            },
            selectType (type) {
                this.selectedLeaveType = type;
                this.leaveTypeSelection = false;
            },
            // onStartChange (event) {
            //     this.selectedStartDate = event.detail.value;
            // },
            onStartConfirm(e) {
                const date = new Date(e.value);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                this.selectedStartDate = `${year}-${month}-${day}`;
                this.selectedStartTime = `${hour}:${minute}`;
                this.showStartDate = false;
            },
            onEndConfirm(e) {
                const date = new Date(e.value);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                this.selectedEndDate = `${year}-${month}-${day}`;
                this.selectedEndTime = `${hour}:${minute}`;
                if (this.selectedEndDate && this.selectedEndDate < this.selectedStartDate) {
                    uni.showToast({ title: "Invalid end time", icon: "none" });
                } else {
                    this.showEndDate = false;
                }
            },
            // onStartTimeChange (event) {
            //     this.selectedStartTime = event.detail.value;
            // },
            // onEndChange (event) {
            //     this.selectedEndDate = event.detail.value;
            //     if (this.selectedEndDate && this.selectedEndDate < this.selectedStartDate) {
            //         this.selectedEndDate = "";
            //         uni.showToast({ title: "Invalid end date", icon: "none" });
            //     }
            // },
            // onEndTimeChange (event) {
            //     this.selectedEndTime = event.detail.value;                
            // },
            async handleSubmit () { 
                console.log(this.selectedStartValue)
                const data = {
                    userId: uni.getStorageSync("id"),
                    requestType: this.selectedLeaveType,
                    startTime: this.formatTime(this.selectedStartValue),
                    endTime:this.formatTime(this.selectedEndValue),
                    status: "Pending",
                    note: this.note
                }
                uni.showLoading() 
                    
                console.log("data send", data);
                if (this.selectedLeaveType === "OUTSIDE" || this.selectedLeaveType === "OTHER"|| this.selectedLeaveType === "MEETING"
                    || this.selectedLeaveType === "MEETING"
                ) {
                    try {
                        const res = await sendRemoteRequest(data);
                        uni.hideLoading()
                        if (res.statusCode === 200) {
                            if (res.data.status === 1) {
                                console.log(res);
                                this.$emit("handleSubmit");
                            } else {
                                console.log(res.data);
                                uni.showModal({
                                    content: res.data.msg,
                                    confirmText: 'OK', 
                                    showCancel:false
                                }) 
                                
                            }
                        } else {
                            console.log(res);
                            uni.showToast({ title: "Faile to send your request!", icon: "none" });
                        }
                    } catch (error) {
                        uni.hideLoading()
                        console.error("Error:", error);
                        uni.showToast({ title: "Fail to send your request!", icon: "none" });
                    }
                } else {
                    try {
                        const res = await sendLeaveRequest(data);
                        uni.hideLoading()
                        if (res.statusCode === 200) {
                            if (res.data.status === 1) {
                                console.log(res);
                                this.$emit("handleSubmit");
                            } else {
                                console.log(res.data);
                                uni.showToast({ title: "Your request is not allowed", icon: "none" });
                            }
                        } else {
                            console.log(res);
                            uni.showToast({ title: "Faile to send your request!", icon: "none" });
                        }
                    } catch (error) {
                        uni.hideLoading()
                        console.error("Error:", error);
                        uni.showToast({ title: "Fail to send your request!", icon: "none" });
                    }
                }
            },
            formatTime (dateStr) {
                let dates = dateStr.split(" ")
                console.log(dates)
                const date = new Date(`${dates[0]}T${dates[1]}:00`);
                return date.toISOString();
            }
        }
    }
</script>

<style scoped lang="scss">
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100%;
        background: rgba(0, 0, 0, 0.50);
        z-index: 101;
    }
    .leave_request {
        position: fixed;
        width: 670rpx;
        max-height: 80vh;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 40rpx;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
        z-index: 102;
    }
    .title {
        width: 670rpx;
        text-align: center;
        color: #000;
        font-family: Nunito;
        font-size: 40rpx;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.2px;
        margin-bottom: 50rpx;
    }
    .leave_opt {
        width: 670rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
    }
    .request_title {
        color: #475467;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: -0.2px;
        margin-bottom: 10rpx;
        margin-top: 30rpx;
    }
    .selection {
        width: 600rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 30rpx;
        border-radius: 8px;
        border: 1px solid #DADADA;
        background: #FFF;
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    }
    .selection image {
        width: 30rpx;
        height: 30rpx;
    }
    .selection text {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.25px;
    }
    .type_menu {
        width: 600rpx;
        padding: 20rpx 30rpx;
        background: #fff;
        border: 1px solid #DADADA;
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        align-items: start;
        z-index: 2;
    }
    .active {
        border-radius: 8px 8px 0 0;
        border-bottom: none;
    }
    .type {
        width: 670rpx;
    }
    textarea {
        width: 600rpx;
        padding: 20rpx 30rpx;
        border-radius: 8px;
        border: 1px solid #DADADA;
        background: #FFF;
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        font-family: Nunito;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.25px;
    }
    button {
        display: flex;
        width: 670rpx;
        height: 85rpx;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border: none;
        background: #EFC462;
        color: #fff;
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
        margin-top: 30rpx;
    }
</style>