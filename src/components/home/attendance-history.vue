<template>
    <view class="attendance_history">
        <view class="title_box">
            <text class="title">Attendance History</text>
            <text class="title" :style="{color: '#EFC462'}" @click="showHistory">View More</text>
        </view>
        <view class="recording_card">
            <view v-for="(item,index) in historyOverview" :key=index class="history">
                <view class="recording_title">
                    <image src="/static/Calendar_page_icon.png" alt="calendar"></image>
                    <text>{{ item.date }}</text>
                </view>
                <view class="recording_detail">
                    <view class="details">
                        <text class="sub_title">Total Hours</text>
                        <text class="content">{{ item.workingHrs }}</text>
                    </view>
                    <view class="details1">
                        <text class="sub_title">Clock in & Out</text>
                        <text class="content">{{ item.formattedSignInTime }} - {{ item.formattedSignOutTime }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "AttendanceHistory",
        props: {
            historyOverview: Array
        },    
        methods: {            
            showHistory () {
                uni.navigateTo({ url: "/pages/home/attendance-history-list" })
            }            
        }
    }
</script>

<style scoped>
    .attendance_history {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
        margin-bottom: 30rpx;
    }
    .title_box {
        width: 600rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .title {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .recording_card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 30rpx;
    }
    .history {
        width: 600rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 25rpx;        
    }
    .recording_title {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10rpx;
    }
    .recording_title image {
        width: 30rpx;
        height: 30rpx;
    }
    .recording_title text {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .recording_detail {
        width: 540rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-radius: 12px;
        border: 1px solid #E6E6E6;
        background: var(--Color-Gray-Gray-100, #F9FAFB);
    }
    .details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 15rpx;
    }
    .details1 {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: end;
        gap: 15rpx;
    }
    .sub_title {
        color: #475467;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .content {
        color: #344054;
        font-family: Nunito;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
</style>