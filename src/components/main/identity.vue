<template>
    <view class="identity  "  >
        <view class="identity_text">
            <view class="linename">
                <view class="name">{{ user.firstName }} {{ user.lastName }}</view>
                <view class="status">online</view>
            </view>

            <text class="role">{{ user.department }} {{ user.role[0] }}</text>
        </view>
        <view class="img_box" @click="showNotification">
            <image src="/static/Bell_icon.png" alt="bell"></image>
        </view>
    </view>
</template>

<script>
export default {
    name: "Identity",
    props: { 
        user: Object
    },
    methods: {
        showNotification() {
            uni.navigateTo({ url: "/pages/index/notification" });
        }
    }
}
</script>

<style scoped lang="scss">
 
.identity {
    width: 750rpx;
    height: 200rpx;
    background-color: white; 
    padding: 15rpx; 
    position: sticky;
    top: 0; 
    z-index: 100;

    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;

    .linename {
        display: flex; 
        padding-top:25rpx;
        .status {
            border-radius: 5px;
            background: rgba(4, 177, 10, 0.15);
            color: #04B10A;
            font-family: Inter;
            font-size: 12px;
            font-style: normal;
            font-weight: 500; 
            height: 40rpx;
            line-height: 40rpx;
            padding:0 15rpx;
            margin-top: 10rpx;
            margin-left: 10rpx;
        }
    }
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