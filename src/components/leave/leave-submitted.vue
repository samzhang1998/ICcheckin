<template>
    <view class="overlay" v-if="leaveSubmit">
        <view class="leave_submit">
            <text class="title">Leave Submitted</text>
            <text class="description">Your leave request has been sent for review!<br />Wait for HR to review your request.</text>
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

<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.50);
    }
    .leave_submit {
        width: 90%;
        height: 15vh;
        position: fixed;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 5%;
        gap: 15px;
        border-radius: 16px 16px 0px 0px;
        background: #FFF;
    }
    .title {
        color: #000;
        font-size: 20px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: -0.2px;
    }
    .description {
        color: #838383;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        line-height: 130%;
    }
    button {
        display: flex;
        width: 100%;
        height: 48px;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        border: none;
        background: #EFC462;
        color: #fff;
        border-radius: 100px;
        text-align: center;
        font-family: Nunito;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
    }
</style>