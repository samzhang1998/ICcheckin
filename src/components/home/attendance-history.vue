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
    import { attendanceAllRequest, eachWorkingHours } from '@/api/home';
    export default {
        name: "AttendanceHistory",
        data () {
            return {
                history: []
            }
        },
        mounted () {
            this.getAttendanceAll();
        },        
        methods: {
            async getAttendanceAll () {
                try {
                    const attendanceAll = await attendanceAllRequest();
                    if (attendanceAll.statusCode === 200) {                        
                        this.history = attendanceAll.data.sort((a, b) => new Date(b.signInTime) - new Date(a.signInTime)).slice(0, 3);
                        console.log("all attendance:", this.history);
                    } else {
                        console.log(attendanceAll.text());
						uni.showToast({ title: "Faile to get all attendance!", icon: "none" });
                    }                    
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get all attendance!", icon: "none" });
                }                
            },
            showHistory () {
                uni.navigateTo({ url: "/pages/home/attendance-history-list" })
            },
            formatDate (time) {
                if (!time) return "Invalid Date";
                const dateObj = new Date(time);
                return dateObj.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });
            },
            formatTime (time) {
                if (!time) return "Invalid Time";
                return time.split("T")[1].split(":").slice(0, 2).join(":");
            }
        },
        computed: {
            historyOverview() {
                return this.history.map(item => ({
                    ...item,
                    date: this.formatDate(item.signInTime),
                    formattedSignInTime: this.formatTime(item.signInTime),
                    formattedSignOutTime: this.formatTime(item.signOutTime),
                    workingHrs: eachWorkingHours(item.signInTime, item.signOutTime)
                }));
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
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .content {
        color: #344054;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
</style>