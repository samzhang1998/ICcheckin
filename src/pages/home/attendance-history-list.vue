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
                        this.list = attendanceAll.data.slice(0, 50);
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

<style scoped>
    .history_list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background:linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .title {
        width: 100%;
        height: 100px;
        background: #fff;
        border-bottom: 1px solid #DADADA;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    .title image {
        width: 36px;
        height: 36px;
        position: absolute;
        left: 5%;
    }
    .title text {
        color: #101828;
        font-size: 18px;
        font-weight: 700;
        line-height: 140%;
        text-align: center;
    }
    .list {
        width: 84%;
        padding: 3%;
        margin-bottom: 5%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        border-radius: 8px;
        background: #FFF;
    }
    .list_title {
        color: #2B2B2B;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .history_card {
        width: 94%;
        padding: 3%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 10px;
        border-radius: 8px;
        border: 1px solid #EAECF0;
        background: #F9FAFB;
    }
    .date {
        color: #667085;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .time {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10px;
    }
    .img_box {
        width: 27px;
        height: 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: #FDF1D6;
    }
    .time image {
        width: 15px;
        height: 15px;
    }
    .time text {
        color: #1A1A1A;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.24px;
    }
    .loading {
        width: 100%;
        text-align: center;
        color: #667085;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
</style>