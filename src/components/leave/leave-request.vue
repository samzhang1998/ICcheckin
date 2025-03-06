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
                <text class="request_title">Duration</text>
                <view class="selection" @click="showCalendar">
                    <text>{{ selectedDate ? selectedDate : "Select" }}</text>
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                </view>
                <view v-if="calendar" class="calendar">
                    
                </view>
                <text class="request_title">Leave Description</text>
                <textarea placeholder="Enter Leave Description"></textarea>
            </view>            
            <button @click="handleSubmit">Submit Leave</button>
        </view>        
    </view>
</template>

<script>
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
                calendar: false,
                selectedLeaveType: "",
                selectedDate: "",
                leaveTypes: [
                    "Sick Leave",
                    "Annual Leave/Vacation Leave",
                    "Maternity/Paternity Leave",
                    "Personal Leave",
                    "Duty Leave",
                    "Others"
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
            dateSelect () {
                this.selectedDate = `${e.startDate} - ${e.endDate}`;
            },
            handleSubmit () {
                this.$emit("handleSubmit");
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