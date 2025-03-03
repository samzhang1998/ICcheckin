<template>
    <view class="attendance_history" @click="showHistory">
        <text class="title">Attendance History</text>
        <view class="recording_card">
            <view v-for="(item,index) in history" :key=index class="history">
                <view class="recording_title">
                    <image src="/static/Calendar_page_icon.png" alt="calendar"></image>
                    <text>{{ item.date }}</text>
                </view>
                <view class="recording_detail">
                    <view class="details">
                        <text class="sub_title">Total Hours</text>
                        <text class="content">{{ item.time }}</text>
                    </view>
                    <view class="details">
                        <text class="sub_title">Clock in & Out</text>
                        <text class="content">{{ item.period }}</text>
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
            user: String
        },
        data () {
            return {
                history: [
                    {
                        date: "27 September 2024",
                        time: "08:00:00 hrs",
                        period: "09:00 AM  — 05:00 PM"
                    },
                    {
                        date: "26 September 2024",
                        time: "08:00:00 hrs",
                        period: "09:00 AM  — 05:00 PM"
                    },
                    {
                        date: "25 September 2024",
                        time: "08:00:00 hrs",
                        period: "09:00 AM  — 05:00 PM"
                    }
                ]
            }
        },        
        methods: {
            showHistory () {
                uni.navigateTo({ url: "/pages/home/attendance-history-list?name=name" })
            }
        }
    }
</script>

<style scoped>
    .attendance_history {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
        border-radius: 10px;
        background: #FEFEFE;
        margin-bottom: 12px;
    }
    .title {
        color: #101828;
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .recording_card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }
    .history {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 14px;        
    }
    .recording_title {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 3px;
    }
    .recording_title image {
        width: 16px;
        height: 16px;
    }
    .recording_title text {
        color: #101828;
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .recording_detail {
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 5%;
        border-radius: 12px;
        border: 1px solid #E6E6E6;
        background: var(--Color-Gray-Gray-100, #F9FAFB);
    }
    .details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 5px;
    }
    .sub_title {
        color: #475467;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .content {
        color: #344054;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
</style>