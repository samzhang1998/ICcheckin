<template>
    <view class="working_hour">
        <view class="recording_title">
            <text class="title">{{ title }}</text>
            <text class="sub_title">{{ date }}</text>
        </view>
        <view class="recording_card">
            <view class="recording">
                <view class="recording_type">
                    <image src="/static/Clock_icon.png" alt="clock"></image>
                    <text class="recording_period">Last Attendance</text>
                </view>
                <view class="recording_hrs">{{ attendanceHrs }}</view>
            </view>
            <view class="recording">
                <view class="recording_type">
                    <image src="/static/Clock_icon.png" alt="clock"></image>
                    <text class="recording_period">{{ attendanceType }}</text>
                </view>
                <view class="recording_hrs">{{ workingHrs }}</view>
            </view>
        </view>
        <button :style="{background: isClockedIn ? '#000' : '#EFC462'}" @click="handleClick">{{ buttonText }}</button>
    </view>
</template>

<script>

    export default {
        name: "WorkingHour",
        props: {
            date: String,
            workingHrs: String,
            attendanceHrs: String,
            isClockedIn: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            title () {
                return this.isClockedIn? "You have already checked in!" : "You have not checked in now!";
            },
            attendanceType () {
                return this.isClockedIn? "This Attendance" : "Today";
            },
            buttonText () {
                return this.isClockedIn? "Check Out" : "Check In Now";
            }
        },
        methods: {
            handleClick() {
                this.$emit("buttonClick");
            }
        }
    }
</script>

<style scoped>
    .working_hour {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
    }
    .recording_title {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .title {
        color: #101828;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .sub_title {
        color: #475467;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .recording_card {        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30rpx;
    }
    .recording {
        width: 230rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 20rpx;
        padding: 30rpx;
        border-radius: 8px;
        border: 1px solid #EBECEE;
        background: #F9F9F9;
    }
    .recording_type {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10rpx;
    }
    .recording image {
        width: 30rpx;
        height: 30rpx;
    }
    .recording_period {
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
        color: #475467;
    }
    .recording_hrs {
        color: #161B23;
        font-size: 40rpx;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0px;
    }
    button {
        display: flex;
        width: 600rpx;
        height: 85rpx;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border-radius: 100px;
        border: none;
        color: #fff;
        text-align: center;
        font-family: Nunito;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
	}
</style>