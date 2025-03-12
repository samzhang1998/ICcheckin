<template>
    <view class="identity">
        <view class="identity_text">
            <text class="name">{{ firstName }} {{ lastName }}</text>
            <text class="role">{{ role }}</text>
        </view>
        <view class="img_box"><image src="/static/Bell_icon.png" alt="bell"></image></view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                firstName: "",
                lastName: "",
                role: "",
            }
        },
        mounted () {
            this.firstName = uni.getStorageSync("firstName");
            this.lastName = uni.getStorageSync("lastName");
            this.role = uni.getStorageSync("role");
        }
    }
</script>

<style scoped>
    .identity {
        width: 675rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 100rpx;
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
        font-size: 40rpx;
        font-weight: 600;
        letter-spacing: -0.4px;
    }
    .role {
        color: #838383;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.4px;
    }
</style>