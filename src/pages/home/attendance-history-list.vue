<template>
    <view class="history_list">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>{{ firstName }} {{ lastName }}</text>
        </view>
        <view class="list">
            <text class="list_title">Attendance History</text>
            <view v-for="(item,index) in history" :key="index" class="history_card">
                <text class="date">{{ item.date }}</text>
                <view class="time">
                    <view class="img_box"><image src="/static/Check_in_complete.png"></image></view>
                    <text>{{ item.formattedSignInTime }} am</text>
                    <view class="img_box"><image src="/static/Check_out_complete.png"></image></view>
                    <text>{{ item.formattedSignOutTime }} pm</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { attendanceAllRequest } from '@/api/home';
    export default {
        data () {
            return {
                list: [],
                firstName: "",
                lastName: ""              
            }
        },
        mounted () {
            this.firstName = uni.getStorageSync("firstName");
            this.lastName = uni.getStorageSync("lastName");
            this.getAttendanceAll();
        },
        methods: {
            async getAttendanceAll () {
                try {
                    const attendanceAll = await attendanceAllRequest();
                    if (attendanceAll.statusCode === 200) {                      
                        this.list = attendanceAll.data.sort((a, b) => new Date(b.signInTime) - new Date(a.signInTime)).slice(0, 50);
                        console.log("all attendance:", this.list);
                    } else {
                        console.log(attendanceAll.text());
						uni.showToast({ title: "Faile to get all attendance!", icon: "none" });
                    }                    
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get all attendance!", icon: "none" });
                }                
            },
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
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
            history () {
                return this.list.map(item => ({
                    ...item,
                    date: this.formatDate(item.signInTime),
                    formattedSignInTime: this.formatTime(item.signInTime),
                    formattedSignOutTime: this.formatTime(item.signOutTime),
                }));
            }
        }
    }
</script>

<style scoped lang="scss">
    .history_list {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background:linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
    }
    .title {
        width: 750rpx;
        height: 150rpx;
        padding-bottom: 30rpx;
        background: #fff;
        display: flex;
        align-items: end;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .title image {
        width: 50rpx;
        height: 50rpx;
        position: absolute;
        left: 40rpx;
    }
    .title text {
        color: #101828;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 35rpx;
        font-weight: 700;
        line-height: 140%;
        text-align: center;
    }
    .list {
        width: 600rpx;
        padding: 40rpx;
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 30rpx;
        border-radius: 8px;
        background: #FFF;
    }
    .list_title {
        color: #2B2B2B;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 30rpx;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .history_card {
        width: 540rpx;
        padding: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 20rpx;
        border-radius: 8px;
        border: 1px solid #EAECF0;
        background: #F9FAFB;
    }
    .date {
        color: #667085;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 26rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .time {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 20rpx;
    }
    .img_box {
        width: 50rpx;
        height: 50rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: #FDF1D6;
    }
    .time image {
        width: 25rpx;
        height: 25rpx;
    }
    .time text {
        color: #1A1A1A;
        text-align: center;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.24px;
    }
</style>