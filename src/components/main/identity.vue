<template>
    <view class="identity">
        <view class="identity_text">
            <text class="name">{{ firstName }} {{ lastName }}</text>
            <text class="role">{{ department }} {{ title }}</text>
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
                department: "",
                title: ""
            }
        },
        mounted () {
            this.firstName = uni.getStorageSync("firstName");
            this.lastName = uni.getStorageSync("lastName");
            this.department = uni.getStorageSync("department");
            this.title = uni.getStorageSync("title");
        }
    }
</script>

<style scoped>
    .identity {
        width: 675rpx;
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