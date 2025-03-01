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
                    <text class="time">{{ today }}</text>
                </view>
                <view class="time_box">
                    <view class="box_title">
                        <image src="/static/Clock_icon.png" alt="clock"></image>
                        <text>Overtime</text>
                    </view>
                    <text class="time">{{ overtime }}</text>
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
            today: String,
            overtime: String,
            clockOut: {
                type: Boolean,
                default: false
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
        width: 100%;
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
        padding: 10%;
        gap: 15px;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
    }
    .title {
        color: #101828;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
    }
    .message {
        color: #475467;
        font-size: 13px;
        font-weight: 500;
        line-height: 130%;
    }
    .check_time {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .time_box {
        width: 42%;
        padding: 3%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
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
        gap: 3px;
    }
    .box_title image {
        width: 16px;
        height: 16px;
    }
    .box_title text {
        color: #475467;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .time {
        color: #161B23;
        font-size: 20px;
        font-weight: 400;
        letter-spacing: -0.5px;
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
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 16px;
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