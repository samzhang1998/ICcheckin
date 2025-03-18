<template>
    <view v-if="user.role[0] !== 'ADMIN'" class="work_leave">
        <view class="title">
            <view class="selection" @click="changeLeave">
                <text>{{ selectedType.leaveTypeName }}</text>
                <image src="/static/Arrow_down.png" alt="arrow-down"></image>
            </view>
            <view v-if="leave" class="menu">
                <view 
                    v-for="(type, index) in leaveInfo" 
                    :key="index" 
                    class="type"
                    @click="selectType(type)"
                >
                    {{ type.leaveTypeName }}
                </view>
            </view>
            <text class="period">{{ date }}</text>
        </view>
        <view v-if="selectedType" class="leave_info">
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Clock_icon.png"></image>
                    <text>Available</text>
                </view>
                <text class="hrs">{{ selectedType.balance }} Hrs</text>
            </view>
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Clock_icon.png"></image>
                    <text>Leave used</text>
                </view>
                <text class="hrs">{{ selectedType.used }} Hrs</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "WorkLeave",
        props: {
            leave: {
                type: Boolean,
                default: false
            },
            selectedType: Object,
            leaveInfo: Array,
            user: Array,
            date: String
        },
        methods: {
            changeLeave () {
                this.$emit("changeLeave");
            },
            selectType (type) {
                this.$emit("selectType", type);
            }
        }
    }
</script>

<style scoped>
    .work_leave {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
    }
    .title {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .title_text {
        color: #101828;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .selection {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10rpx;
    }
    .selection image {
        width: 30rpx;
        height: 30rpx;
    }
    .menu {
        width: 300rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20rpx;
        align-items: start;
        position: absolute;
        top: 300rpx;
        background: #fff;
        border: none;
    }
    .period {
        color: #475467;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .leave_info {
        width: 600rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30rpx;
    }
    .leave_box {
        width: 230rpx;
        padding: 30rpx;
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        border-radius: 8px;
        border: 1px solid var(--Color-Gray-Gray-50, #EBECEE);
        background: #F9F9F9;
    }
    .box_title {
        display: flex;
        flex-direction: row;
        gap: 10rpx;
    }
    .box_title image {
        width: 30rpx;
        height: 30rpx;
    }
    .box_title text {
        color: #475467;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .hrs {
        color: #161B23;
        font-size: 40rpx;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0px;
    }
</style>