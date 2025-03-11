<template>
    <view v-if="leaveRequest" class="overlay" @click="cancleLeaveRequest">
        <view class="leave_request" @click.stop>            
            <view class="leave_opt"> 
                <text class="title">Request</text> 
                <text class="request_title">Request Type</text>              
                <view class="selection" @click="showLeaveType">
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
                <text class="request_title">Start date</text>
                <view class="selection" @click="openStartPicker">
                    <picker mode="date" :value="selectedStartDate" @change="onStartChange" ref="startPicker">                      
                        <text>{{ selectedStartDate || "Select" }}</text>
                    </picker>                    
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>                    
                </view>
                <text class="request_title">End date</text>
                <view class="selection" @click="openEndPicker">
                    <picker mode="date" :value="selectedEndDate" @change="onEndChange" ref="endPicker">                      
                        <text>{{ selectedEndDate || "Select" }}</text>
                    </picker>                    
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>                    
                </view>
                <text class="request_title">Leave Description</text>
                <textarea v-model="note" placeholder="Enter Leave Description"></textarea>
            </view>            
            <button @click="handleSubmit">Submit Leave</button>
        </view>        
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
                selectedEndDate: "",
                note: "",
                leaveTypes: [
                    "ANNUAL",
                    "SICK",
                    "REMOTE"
                ]
            }
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
            showCalendar () {
                this.calendar = !this.calendar;
            },
            selectType (type) {
                this.selectedLeaveType = type;
                this.leaveTypeSelection = false;
            },
            onStartChange (event) {
                this.selectedStartDate = event.detail.value;                
            },
            onEndChange (event) {
                this.selectedEndDate = event.detail.value;
                if (this.selectedEndDate && this.selectedEndDate < this.selectedStartDate) {
                    this.selectedEndDate = "";
                    uni.showToast({ title: "Invalid end date", icon: "none" });
                }
            },
            openStartPicker () {
                this.$refs.startPicker.$el.click();
            },
            openEndPicker () {
                this.$refs.endPicker.$el.click();
            },
            async handleSubmit () {
                const data = {
                    userId: uni.getStorageSync("id"),
                    requestType: this.selectedLeaveType,
                    startTime: this.formatStart(this.selectedStartDate),
                    endTime: this.formatEnd(this.selectedEndDate),
                    status: "Pending",
                    note: this.note
                }
                console.log("data send", data);
                if (this.selectedLeaveType === "REMOTE") {
                    try {
                        const res = await sendRemoteRequest(data);
                        if (res.statusCode === 200) {
                            console.log(res);
                            this.$emit("handleSubmit");
                        } else {
                            console.log(res);
                            uni.showToast({ title: "Faile to send your request!", icon: "none" });
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        uni.showToast({ title: "Fail to send your request!", icon: "none" });
                    }
                } else {
                    try {
                        const res = await sendLeaveRequest(data);
                        if (res.statusCode === 200) {
                            this.$emit("handleSubmit");
                        } else {
                            console.log(res);
                            uni.showToast({ title: "Faile to send your request!", icon: "none" });
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        uni.showToast({ title: "Fail to send your request!", icon: "none" });
                    }
                }                
            },
            formatStart (dateStr) {
                const date = new Date(`${dateStr}T00:00:00Z`);
                return date.toISOString();
            },
            formatEnd (dateStr) {
                const date = new Date(`${dateStr}T23:59:59Z`);
                return date.toISOString();
            }
        }
    }
</script>

<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.50);
        z-index: 0;
    }
    .leave_request {
        width: 90%;
        height: 60vh;
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 5%;
        gap: 15px;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
        z-index: 1;
    }
    .title {
        width: 100%;
        text-align: center;
        color: #000;
        font-size: 20px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.2px;
        margin-bottom: 21px;
    }
    .leave_opt {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
    }
    .request_title {
        color: #475467;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: -0.2px;
        margin-bottom: 5px;
    }
    .selection {
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 3% 5%;
        border-radius: 8px;
        border: 1px solid #DADADA;
        background: #FFF;
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        margin-bottom: 16px;
    }
    .selection image {
        width: 20px;
        height: 20px;
    }
    .type_menu {
        width: 80%;
        position: absolute;
        top: 120px;
        padding: 3% 5%;
        background: #fff;
        border: 1px solid #DADADA;
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: start;
        z-index: 2;
    }
    .type {
        width: 100%;
    }
    .calendar {
        width: 80%;
        position: absolute;
        top: 203px;
        padding: 3% 5%;
        background: #fff;
        border: 1px solid #DADADA;
        border-radius: 0px 0px 8px 8px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: start;
        z-index: 2;
    }
    textarea {
        width: 94%;
        padding: 3%;
        border-radius: 8px;
        border: 1px solid #DADADA;
        background: #FFF;
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    }
    button {
        display: flex;
        width: 100%;
        height: 48px;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        border: none;
        background: #EFC462;
        color: #fff;
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
    }
</style>