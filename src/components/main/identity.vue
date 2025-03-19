<template>
    <view class="identity">
        <view class="identity_text">
            <text class="name">{{ user.firstName }} {{ user.lastName }}</text>
            <text class="role">{{ user.department }} {{ user.role[0] }}</text>
        </view>
        <view class="img_box" @click="showNotification"><image src="/static/Bell_icon.png" alt="bell"></image></view>
    </view>
</template>

<script>
    export default {
        name: "Identity",
        props: {
            user: Object
        },
        methods: {
            showNotification () {
                uni.navigateTo({ url: "/pages/index/notification" });
            }
        }
    }
</script>

<style scoped lang="scss">
    .identity {
        width: 680rpx;
        height: 200rpx;
        padding-bottom: 30rpx;
        position: sticky;
        top: 0;
        z-index: 100;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: space-between;
    }
    .img_box {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 1px solid #F1F1F1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .identity image {
        width: 45rpx;
        height: 45rpx;
    }
    .identity_text {
        display: flex;
        flex-direction: column;
    }
    .name {
        color: #141414;
        font-family: Nunito;
        font-size: 40rpx;
        font-weight: 600;
        letter-spacing: -0.4px;
    }
    .role {
        color: #838383;
        font-family: Nunito;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.4px;
    }
</style>