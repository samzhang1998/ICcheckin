<template>
    <view v-if="user.role[0] !== 'ADMIN'" class="work_leave">
        <view class="title" >
            Work Leave
            
            <text class="period">{{ date }}</text>
        </view> 
        <view v-if="selectedType" class="leave_info">
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Calendar_light.png"></image>
                    <text>Leave Balance</text>
                </view>
                <text class="hrs">{{ total.leave }} Hours</text>
            </view>
            <view class="leave_box">
                <view class="box_title">
                    <image src="/static/Calendar_light.png"></image>
                    <text>Overtime Balance</text>
                </view>
                <text class="hrs">{{ total.overtime }} Hours</text>
            </view>
        </view>
    </view>
</template>

<script>
 import { leaveInfoRequest, leaveBalanceRequest } from '@/api/leave';
 import {getOvertimeTotal} from '@/api/attendances'
    export default {
        name: "WorkLeave",
        props: {
            leave: {
                type: Boolean,
                default: false
            },
            selectedType: Object, 
            user: Object,
            date: String
        },
        data(){
            return {
                    total:{
                        leave:0,
                        overtime:0
                    },
                    leaveInfo:[]
            }
        },
        mounted() { 
            this.getLeaveBalance()
            this.getOvertime()
        },
        methods: {
            changeLeave () {
                this.$emit("changeLeave");
            },
            selectType (type) {
                this.$emit("selectType", type);
            },
            async getOvertime(){
                
                try {
                    const res = await getOvertimeTotal();
                    console.log(res)
                    if (res.status === 1) {
                        let hours = res.data;
                        let jhours = JSON.parse(hours)
                        console.log("jhours:", jhours); 
                        this.total.overtime = jhours.available
                                      
                    } else   {
                        console.log("Failed get:", res.message);
                        uni.showToast({ title: res.message, icon: "none" });
                    }  
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Cannot get your leave balance!", icon: "none" });
                }
            },
            async getLeaveBalance () {
                try {
                    const res = await leaveBalanceRequest();
                    if (res.statusCode === 200) {
                        this.leaveInfo = res.data.data;
                        console.log("Leave balance11111:", this.leaveInfo);
                        this.total.leave = 0 
                        if(this.leaveInfo && this.leaveInfo.length > 0){
                            //
                            this.leaveInfo.map((item)=>{
                                this.total.leave += item.balance 
                            })
                        }              
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
        }
    }
</script>

<style scoped lang="scss">
    .work_leave {
        width: 700rpx;
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
    .no_balance {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .title_text {
        color: #101828;
        font-family: Nunito;
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
        top: 280rpx;
        background: #fff;
        border: none;
    }
    .period {
        color: #475467;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .leave_info {
        width: 700rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30rpx;
    }
    .leave_box {
        width: 280rpx;
        padding: 30rpx;
        display: flex;
        border: 1px solid red;
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
        font-family: Nunito;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: -0.5px;
    }
    .hrs {
        color: #161B23;
        font-family: Nunito;
        font-size: 40rpx;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0px;
    }
</style>