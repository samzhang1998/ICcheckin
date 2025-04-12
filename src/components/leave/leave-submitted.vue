<template>
    <view class="overlay" v-if="leaveSubmit">
        <view class="leave_submit">
            <text class="title">Leave Submitted</text>
            <text class="description">Your leave request has been sent for review!<br />Wait for Admin to review your request.</text>
            <button @click="handleConfirm">Done</button>
        </view>
    </view>
</template>

<script>
    export default {
        name: "LeaveSubmitted",
        props: {
            leaveSubmit: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleConfirm () {
                this.$emit("handleConfirm");
            },
        }
    }
</script>

<style scoped lang="scss">
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 100%;
        background: rgba(0, 0, 0, 0.50);
        z-index: 101;
    }
    .leave_submit {
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 40rpx;
        gap: 30rpx;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
        z-index: 102;
    }
    .title {
        color: #000;
        font-family: Nunito;
        font-size: 40rpx;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
    .description {
        color: #838383;
        text-align: center;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 500;
        line-height: 130%;
    }
    button {
        display: flex;
        width: 675rpx;
        height: 85rpx;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        border: none;
        background: #EFC462;
        color: #fff;
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
    }
</style>