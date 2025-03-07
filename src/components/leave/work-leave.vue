<template>
    <view class="work_leave">
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
    import { leaveBalanceRequest } from '@/api/leave';
    export default {
        name: "WorkLeave",
        props: {
            date: String
        },
        data () {
            return {
                leave: false,
                selectedType: {},
                leaveInfo: [],
            }
        },
        mounted () {
            this.getLeaveBalance();
        },
        methods: {
            async getLeaveBalance () {
                try {
                    const res = await leaveBalanceRequest();
                    if (res.statusCode === 200) {
                        this.leaveInfo = res.data;
                        console.log("Leave balance:", this.leaveInfo);
                        const defaultLeave = this.leaveInfo.find(type => type.leaveTypeName === "ANNUAL");
                        if (defaultLeave) {this.selectedType = defaultLeave;}                
                    } else if (res.statusCode === 400) {
                        console.log("Failed get:", res);
                        uni.showToast({ title: "Invalid user ID!", icon: "none" });
                    } else {
                        console.log("Error:", res);
                        uni.showToast({ title: "Cannot get your leave balance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Cannot get your leave balance!", icon: "none" });
                }
            },
            changeLeave () {
                this.leave = !this.leave;
            },
            selectType (type) {
                this.selectedType = type;
                this.leave = false;
            },
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
    .selection {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    }
    .selection image {
        width: 20px;
        height: 20px;
    }
    .menu {
        width: 33%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        position: absolute;
        top: 18.5%;
        background: #fff;
        border: none;
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