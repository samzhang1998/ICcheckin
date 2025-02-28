<template>
    <view class="attendance_overview">
        <text class="title">Attendance Overview</text>
        <view class="site_card">
            <view v-for="(item, index) in sites" :key="index" class="sites">
                <view class="site_title">
                    <text class="site_no">{{ item.No }}</text>
                    <view class="site_time">
                        <image src="/static/Clock_icon.png" alt="clock"></image>
                        <text>{{ item.time }}</text>
                    </view>
                </view>
                <view class="site_detail">
                    <view class="site_member">
                        <text>{{ item.member }}</text>
                    </view>
                    <button>View Details</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "AttendanceOverview",
        data () {
            return {
                sites: [
                    {
                        No: "Site one (12/15)",
                        time: "09:00 AM - 06:00 PM",
                        member: "Finney, Zoey, Mia, Oliver...+9",
                    },
                    {
                        No: "Site two (12/15)",
                        time: "09:00 AM - 06:00 PM",
                        member: "Finney, Zoey, Mia, Oliver...+9",
                    },
                    {
                        No: "Site three (12/15)",
                        time: "09:00 AM - 06:00 PM",
                        member: "Finney, Zoey, Mia, Oliver...+9",
                    }
                ]
            }
        },
        methods: {

        }
    }
</script>

<style scoped>
    .attendance_overview {
        width: 90%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
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
    .site_card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    .sites {
        width: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 10px;
        padding: 5%;
        border-radius: 12px;
        border: 1px solid #DADADA;
        background: #FBFBFB;
    }
    .site_title {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .site_no {
        color: #2B2B2B;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_time {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: 3px;
    }
    .site_time image {
        width: 16px;
        height: 16px;
    }
    .site_time text {
        color: #475467;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_detail {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .site_member {
        height: 16px;
        padding: 3px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18px;
        border: 1px solid #DADADA;
        background: #FEFEFD;
    }
    .site_member text {
        color: #838383;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_detail button {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        background: #EFC462;
        color: #FFF;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
        margin: 0;
    }
</style>