<template>
    <view class="attendance">
        <view class="recording_title">
            <text class="title">Today's Attendance</text>
            <text class="sub_title">{{ date }}</text>
        </view>
        <view class="recording_card">
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box" :style="{background: checkIn !== 'not checked' ? 'rgba(239, 196, 98, 0.20)' : '#FAFAFA'}">
                        <image :src="checkIn !== 'not checked' ? '/static/Check_in_complete.png' : '/static/Check_in_icon.png'" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check In</text>
                </view>
                <text class="recording_time" :style="{color: checkIn !== 'not checked' ? '#141414' : '#A7A7A7'}">{{ checkIn }}</text>
                <text class="recording_comment" :style="{color: checkIn !== 'not checked' ? (statusIn === 'Come on time' ? '#141414' : 'red') : '#A7A7A7'}">{{ statusIn}}</text>
            </view>
            <view class="recording">
                <view class="recording_type">
                    <view class="image_box" :style="{background: checkOut !== 'not checked' ? 'rgba(239, 196, 98, 0.20)' : '#FAFAFA'}">
                        <image :src="checkOut !== 'not checked' ? '/static/Check_in_complete.png' : '/static/Check_in_icon.png'" alt="check"></image>
                    </view>
                    <text class="check_in_out">Check Out</text>
                </view>
                <text class="recording_time" :style="{color: checkOut !== 'not checked' ? '#141414' : '#A7A7A7'}">{{ checkOut }}</text>
                <text class="recording_comment" :style="{color: checkOut !== 'not checked' ? (statusOut === 'Leave on time' ? '#141414' : 'red') : '#A7A7A7'}">{{ statusOut}}</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Attendance",
        props: {
            date: String,
            todayHistory: Array,
            isClockedIn: {
                type: Boolean,
                default: false
            }
        },
        // data () {
        //     return {
        //         todayHistory: []
        //     }
        // },
        computed: {
            checkIn () {
                if (this.todayHistory.length > 0) {
                    const attendanceToday = this.todayHistory[this.todayHistory.length - 1];
                    const time = attendanceToday.signInTime.split("T")[1].split(":").slice(0, 2).join(":");
                    return time
                } else {
                    return "not checked"
                }
            },
            checkOut () {
                if (this.isClockedIn) {
                    return "not checked";
                } else if (this.todayHistory.length > 0){
                    const attendanceToday = this.todayHistory[0];
                    if (attendanceToday.signOutTime) {
                        return attendanceToday.signOutTime.split("T")[1].split(":").slice(0, 2).join(":");
                    } else {
                        return "not checked"
                    }                    
                } else {
                    return "not checked"
                }
            },
            statusIn () {
                const startTime = uni.getStorageSync("scheduleIn");
                const [checkHour, checkMinute] = this.checkIn.split(":").map(Number);
                const [startHour, startMinute] = startTime.split(":").map(Number);
                const lateHour = checkHour - startHour;
                const lateMin = checkMinute - startMinute;
                if (this.checkIn === "not checked") {
                    return "waiting for check"
                } else if (checkHour >= startHour && checkMinute > startMinute) {                    
                    return `Come ${lateHour}h ${lateMin}min later!` 
                } else if (checkHour > startHour && checkMinute < startMinute) {
                    return `Come ${lateHour - 1}h ${lateMin + 60}min later!`
                } else {
                    return "Come on time"
                }
            },
            statusOut () {
                const startTime = uni.getStorageSync("scheduleOut");
                const [checkHour, checkMinute] = this.checkOut.split(":").map(Number);
                const [endHour, endMinute] = startTime.split(":").map(Number);
                const earlyHour = endHour - checkHour;
                const earlyMin = endMinute - checkMinute;
                if (this.checkOut === "not checked") {
                    return "waiting for check"
                } else if (checkHour <= endHour && checkMinute < endMinute) {
                    return `Leave ${earlyHour}h ${earlyMin}min earlier!`
                } else if (checkHour < endHour && checkMinute > endMinute) {
                    return `Leave ${earlyHour - 1}h ${earlyMin + 60}min earlier!`
                } else {                    
                    return "Leave on time"
                    
                }
            }
        },
        // methods: {
        //     getTodayHistory () {
        //         const today = new Date().toLocaleDateString("en-CA").split("T")[0];
        //         this.todayHistory = this.history.filter(item => item.signInTime.include(today));
        //         console.log("Today's history", this.todayHistory);
        //     }
        // },
        // mounted () {
        //     getTodayHistory()
        // }
    }
</script>

<style scoped lang="scss">
    .attendance {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
    }
    .recording_title {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .title {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .sub_title {
        color: #475467;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .recording_card {        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 30rpx;
    }
    .recording {
        width: 230rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: start;
        padding: 30rpx;
        border-radius: 14px;
        border: 1px solid #F1F1F1;
        background: #FFF;
    }
    .recording_type {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-bottom: 20rpx;
        gap: 20rpx;
    }
    .recording image {
        width: 30rpx;
        height: 30rpx;
    }
    .image_box {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        background: #FAFAFA;
    }
    .check_in_out {
        color: #141414;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        letter-spacing: -0.32px;
    }
    .recording_time {
        color: #A7A7A7;
        font-family: Nunito;
        font-size: 35rpx;
        font-weight: 700;
        letter-spacing: -0.36px;
    }
    .recording_comment {
        color: #A7A7A7;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.32px;
    }
</style>