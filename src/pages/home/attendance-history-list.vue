<template>
    <view class="history_list">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>{{ name }}</text>
        </view>
        <view class="list">
            <text class="list_title">Attendance History</text>
            <view v-for="(item,index) in list" :key="index" class="history_card">
                <text class="date">{{ item.date }}</text>
                <view class="time">
                    <view class="img_box"><image src="/static/Check_in_complete.png"></image></view>
                    <text>{{ item.checkIn }}</text>
                    <view class="img_box"><image src="/static/Check_out_complete.png"></image></view>
                    <text>{{ item.checkOut }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                list: [
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                    {
                        date: "February 10, 2025",
                        checkIn: "09:25 am",
                        checkOut: "06:15 pm"
                    },
                ]
            }
        },
        onLoad (options) {
            this.name = options.name;
        },
        methods: {
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
            }
        }
    }
</script>

<style scoped>
    .history_list {
        width: 100%;
        height: 100vh;
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
</style>