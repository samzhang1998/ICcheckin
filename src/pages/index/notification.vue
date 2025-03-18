<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="goBack" />
            <text>Notification</text> 
        </view> 
    </view>
</template>

<script>
    import { getNotification, setNotificationRead, pushNotificationAdmin, pushNotificationUser } from '@/api/notification'
    export default {
        data () {
            return {
                title: uni.getStorageSync("title"),
                    
            }
        },
        methods: {
            goBack () {
                uni.navigateBack({
                    delta: 1
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .maindiv{
        width: 750rpx;
        min-height: 100vh;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
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
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
    }
</style>