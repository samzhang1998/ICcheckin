<template>
    <view class="attendance">
        <view class="recording_title">
            <text class="title">Today's Attendance</text>
            <text class="sub_title">{{ date }}</text>
        </view>
        <view class="recording_card">
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box" :style="{background: checkIn !== 'not checked' ? 'rgba(239, 196, 98, 0.20)' : '#FAFAFA'}">
                        <image :src="checkIn !== 'not checked' ? '/static/Check_in_complete.png' : '/static/Check_in_icon.png'" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check In</text>
                </view>
                <text class="recording_time" :style="{color: checkIn !== 'not checked' ? '#141414' : '#A7A7A7'}">{{ checkIn }}</text>
                <text class="recording_comment" :style="{color: checkIn !== 'not checked' ? '#141414' : '#A7A7A7'}">On Time</text>
            </view>
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box" :style="{background: checkOut !== 'not checked' ? 'rgba(239, 196, 98, 0.20)' : '#FAFAFA'}">
                        <image :src="checkOut !== 'not checked' ? '/static/Check_in_complete.png' : '/static/Check_in_icon.png'" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check Out</text>
                </view>
                <text class="recording_time" :style="{color: checkOut !== 'not checked' ? '#141414' : '#A7A7A7'}">{{ checkOut }}</text>
                <text class="recording_comment" :style="{color: checkOut !== 'not checked' ? '#141414' : '#A7A7A7'}">Go Home</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Attendance",
        props: {
            date: String,
            checkInTime: String,
            checkOutTime: String,
            isClockedIn: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            checkIn () {
                if (this.isClockedIn === true) {
                    return uni.getStorageSync("checkInTime");
                } else if (this.checkInTime) {
                    return this.checkInTime;
                } else {
                    return "not checked";
                }
            },
            checkOut () {
                if (this.isClockedIn === true) {
                    return "not checked";
                } else if (this.checkOutTime) {
                    return this.checkOutTime;
                } else {
                    return "not checked";
                }
            }
        }
    }
</script>

<style scoped>
    .attendance {
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
        justify-content: space-around;
        align-items: start;
        padding: 30rpx;
        border-radius: 14px;
        border: 1px solid #F1F1F1;
        background: #FFF;
    }
    .recording_type {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-bottom: 20rpx;
        gap: 20rpx;
    }
    .recording image {
        width: 30rpx;
        height: 30rpx;
    }
    .image_box {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        background: #FAFAFA;
    }
    .check_in_out {
        color: #141414;
        font-size: 26rpx;
        font-weight: 600;
        letter-spacing: -0.32px;
    }
    .recording_time {
        color: #A7A7A7;
        font-size: 35rpx;
        font-weight: 700;
        letter-spacing: -0.36px;
    }
    .recording_comment {
        color: #A7A7A7;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.32px;
    }
</style>