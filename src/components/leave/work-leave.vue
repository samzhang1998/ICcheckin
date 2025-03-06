<template>
    <view class="work_leave">
        <view class="title">
            <view class="selection" @click="changeLeave">
                <text>{{ leaveType }}</text>
                <image src="/static/Arrow_down.png" alt="arrow-down"></image>
            </view>
            <view v-if="leave" class="menu">
                <view 
                    v-for="(type, index) in leaveTypes" 
                    :key="index" 
                    class="type"
                    @click="selectType(type)"
                >
                    {{ type }}
                </view>
            </view>
            <text class="period">{{ user[0].period }}</text>
        </view>
        <view class="leave_info">
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Clock_icon.png"></image>
                    <text>Available</text>
                </view>
                <text class="hrs">{{ user[0].availableHrs }}</text>
            </view>
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Clock_icon.png"></image>
                    <text>Leave used</text>
                </view>
                <text class="hrs">{{ user[0].usedHrs }}</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "WorkLeave",
        props: {
            user: {
                type: Array,
                required: true
            }
        },
        data () {
            return {
                leave: false,
                leaveTypes: [
                    {label: "Annual Leave", value: "annual leave"},
                    {label: "Sick Leave", value: "sick leave"}
                ]
            }
        }
    }
</script>

<style scoped>
    .work_leave {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .period {
        color: #475467;
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
    }
    .leave_info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .leave_box {
        width: 45%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        border-radius: 8px;
        border: 1px solid var(--Color-Gray-Gray-50, #EBECEE);
        background: #F9F9F9;
    }
    .box_title {
        display: flex;
        flex-direction: row;
        gap: 3px;
    }
    .box_title image {
        width: 16px;
        height: 16px;
    }
    .box_title text {
        color: #475467;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .hrs {
        color: #161B23;
        font-size: 22px;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0px;
    }
</style>