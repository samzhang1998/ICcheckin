<template>
    <view class="attendance">
        <view class="recording_title">
            <text class="title">Today's Attendance</text>
            <text class="sub_title">{{ timeTrack }}</text>
        </view>
        <view class="recording_card">
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box" :style="{background: isClockedIn ? 'rgba(239, 196, 98, 0.20)' : '#FAFAFA'}">
                        <image :src="isClockedIn ? '/static/Check_in_complete.png' : '/static/Check_in_icon.png'" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check In</text>
                </view>
                <text class="recording_time" :style="{color: isClockedIn ? '#141414' : '#A7A7A7'}">9:00</text>
                <text class="recording_comment" :style="{color: isClockedIn ? '#141414' : '#A7A7A7'}">On Time</text>
            </view>
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box">
                        <image src="/static/Check_out_icon.png" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check Out</text>
                </view>
                <text class="recording_time">6:00</text>
                <text class="recording_comment">Go Home</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Attendance",
        props: {
            timeTrack: String,
            isClockedIn: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                checkInTime: "",
                checkOutTime: ""
            }
        }
    }
</script>

<style scoped>
    .attendance {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
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
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .sub_title {
        color: #475467;
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
    }
    .recording_card {        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .recording {
        width: 162px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: start;
        padding: 3%;
        border-radius: 14px;
        border: 1px solid #F1F1F1;
        background: #FFF;
    }
    .recording_type {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-bottom: 5px;
        gap: 7px;
    }
    .recording image {
        width: 18px;
        height: 18px;
    }
    .image_box {
        width: 34px;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        background: #FAFAFA;
    }
    .check_in_out {
        color: #141414;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.32px;
    }
    .recording_time {
        color: #A7A7A7;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.36px;
    }
    .recording_comment {
        color: #A7A7A7;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.32px;
    }
</style>