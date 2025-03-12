<template>
    <view v-if="clockOut" class="overlay">
        <view class="clock_out">
            <text class="title">Confirm Clockout</text>
            <text class="message">Once you clock out, you won't be able to edit this time. Please double-check your hours before proceeding.
            </text>
            <view class="check_time">
                <view class="time_box">
                    <view class="box_title">
                        <image src="/static/Clock_icon.png" alt="clock"></image>
                        <text>Today</text>
                    </view>
                    <text class="time">{{ workingHrs }}</text>
                </view>
                <view class="time_box">
                    <view class="box_title">
                        <image src="/static/Clock_icon.png" alt="clock"></image>
                        <text>Overtime</text>
                    </view>
                    <text class="time">{{ overtimeHrs }}</text>
                </view>
            </view>
            <button class="confirm" @click="handleConfirm">Yes, Clock Out</button>
            <button class="cancle" @click="handleCancle">No, Let me check</button>
        </view>
    </view>
</template>

<script>
    export default {
        name: "ClockOut",
        props: {
            workingHrs: String,
            clockOut: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            overtimeHrs () {
                const [hours, minutes] = this.workingHrs.split(" Hrs")[0].split(":").map(Number);
                const totalMinutes = hours * 60 + minutes;
                const standardMinutes = 8 * 60;
                const overtimeMinutes = Math.max(0, totalMinutes - standardMinutes);
                const overtimeHours = Math.floor(overtimeMinutes / 60);
                const overtimeMins = overtimeMinutes % 60;
                return overtimeMinutes > 0 ? `${overtimeHours}:${overtimeMins.toString().padStart(2, "0")} Hrs` : "0:00 Hrs";
            }
        },
        methods: {
            handleConfirm () {
                this.$emit("handleConfirm");
            },
            handleCancle () {
                this.$emit("handleCancle");
            }
        }
    }
</script>

<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100%;
        background: rgba(0, 0, 0, 0.50);
    }
    .clock_out {
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 70rpx;
        gap: 30rpx;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
    }
    .title {
        color: #101828;
        text-align: center;
        font-size: 40rpx;
        font-weight: 600;
    }
    .message {
        color: #475467;
        font-size: 26rpx;
        font-weight: 500;
        line-height: 130%;
    }
    .check_time {
        width: 610rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 30rpx;
    }
    .time_box {
        width: 470rpx;
        padding: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20rpx;
        align-items: start;
        border-radius: 8px;
        border: 1px solid var(--Color-Gray-Gray-50, #EBECEE);
        background: #F9F9F9;
    }
    .box_title {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10rpx;
    }
    .box_title image {
        width: 16px;
        height: 16px;
    }
    .box_title text {
        color: #475467;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .time {
        color: #161B23;
        font-size: 40rpx;
        font-weight: 400;
        letter-spacing: -0.5px;
    }
    button {
        display: flex;
        width: 610rpx;
        height: 85rpx;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
    }
    .confirm {
        border: none;
        background: #EFC462;
        color: #fff;
    }
    .cancle {
        border: 1px solid #EFC462;
        background: #fff;
        color: #EFC462;
    }
</style>