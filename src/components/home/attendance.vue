<template>
    <view class="attendance">
        <view class="recording_title">
            <text class="title">Today's Attendance</text>
            <text class="sub_title">{{ period }}</text>
        </view>
        <view class="recording_card">
            <view v-for="(item,index) in check" :key="index" class="recording">
                <view class="recording_type">
                    <view class="image_box">
                        <image :src="item.imgsrc" alt="check"></image>
                    </view>
                    <text class="check_in_out">{{ item.type }}</text>
                </view>
                <view class="recording_time">{{ item.time }}</view>
                <view class="recording_comment">{{ item.comment }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Attendance",
        props: {
            period: String
        },
        data () {
            return {
                check: [
                    {
                        imgsrc: '/static/Check_in_icon.png',
                        type: 'Check In',
                        time: '09:00 am',
                        comment: 'On Time'
                    },
                    {
                        imgsrc: '/static/Check_out_icon.png',
                        type: 'Check Out',
                        time: '06:00 pm',
                        comment: 'Go Home'
                    }
                ]  
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
        margin-bottom: 12px;
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