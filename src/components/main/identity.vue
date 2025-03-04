<template>
    <view class="identity">
        <view class="identity_text">
            <text class="name">{{ name }}</text>
            <text class="role">{{ role }}</text>
        </view>
        <view class="img_box"><image src="/static/Bell_icon.png" alt="bell"></image></view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                name: "",
                role: "",
            }
        },
        mounted () {
            this.name = uni.getStorageSync("name");
            this.role = uni.getStorageSync("role");
        }
    }
</script>

<style scoped>
    .identity {
        width: 90%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 50px;
    }
    .img_box {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 1px solid #F1F1F1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .identity image {
        width: 24px;
        height: 24px;
    }
    .identity_text {
        display: flex;
        flex-direction: column;
    }
    .name {
        color: #141414;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.4px;
    }
    .role {
        color: #838383;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.4px;
    }
</style>