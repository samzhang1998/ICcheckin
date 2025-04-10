<template>
    <view class="list">
        <text class="list_title">Attendance History</text>
        <view v-for="(item,index) in history" :key="index" class="history_card">
            <view class="headerline">
                <view class="left">
                    <image src="/static/Calendar_page_icon.png" class="img"></image>
                    <text class="date">{{ item.signInTime   |filterDate }}</text> 
                </view> 
                <view class="latemsg" v-if="item.lateTime">
                       {{ item.lateTime }}
                </view>
            </view>
            
            <view class="time">
                <view class="img_box"><image src="/static/Check_in_complete.png"></image></view>
                <text>{{ item.signInTime|filterTime }}</text>
                <view class="img_box"><image src="/static/Check_out_complete.png"></image></view>
                <text>{{ item.signOutTime |filterTime }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "Identity",
    props: { 
        history: Array
    },
    filters: {
        filterDate(datestr) {
            if (datestr){
                let datas = datestr.split(" ")
                return datas[0];

            }else{
                return ""
            }
            
        },
        filterTime(datestr) {
            if (datestr){
                let datas = datestr.split(" ")
                return datas[1];

            }else{
                return ""
            }
        }, 
    },
    methods: { 
    }
}
</script>

<style scoped lang="scss">
  .list {
        width: 700rpx;
        padding: 40rpx;
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: start; 
        border-radius: 8px;
        background: #FFF;
        .headerline{
            display: flex;
            justify-content: space-between;
            width: 660rpx;
            border: 1px solid red;
            .latemsg{
                color: #F95555; 
                font-family: Inter;
                font-size: 12px; 
                font-weight: 500; 
            }
            .date{
                color: var(--Main-Text, #333);
                font-family: Inter;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

        }
        .time image {
            width: 25rpx;
            height: 25rpx;
        }
        .img{
            width: 40rpx;
            height: 40rpx;
        }
        .time {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            gap: 20rpx;
            .img_box {
                width: 50rpx;
                height: 50rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 6px;
                background: #FDF1D6;
            }
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
            margin-top: 25rpx;
            width: 660rpx;
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
    }
</style>