<template>
    <view class="home">
        <identity></identity>
        <working-hour 
            :timeTrack="timeTrack" 
            :isClockedIn="isClockedIn" 
            :buttonText="buttonText"
            @buttonClick="handleButtonClick"
        ></working-hour>
        <attendance 
            :timeTrack="timeTrack"
            :isClockedIn="isClockedIn"
        ></attendance>
        <attendance-overview></attendance-overview>
        <attendance-history></attendance-history>
        <clock-out
            :clockOut="clockOut"
            :today="today"
            :overtime="overtime"
            @handleConfirm="onConfirm"
            @handleCancle="onCancle"
        ></clock-out>
    </view>
</template>

<script>
    import WorkingHour from '@/components/home/working-hour.vue';
    import Attendance from '@/components/home/attendance.vue';
    import AttendanceOverview from '@/components/home/attendance-overview.vue';
    import AttendanceHistory from '@/components/home/attendance-history.vue';
    import ClockOut from '@/components/home/clock-out.vue';
    import { attendanceTodayRequest, attendanceAllRequest } from '@/api/home';
    export default {
        components: {
            WorkingHour,
            Attendance,
            AttendanceOverview,
            AttendanceHistory,
            ClockOut
        },
        data () {
            return {
                buttonText: "Clock In Now",
                isClockedIn: false,
                today: "08:00:00 Hrs",
                overtime: "00:00:00 Hrs",
                clockOut: false,
                timeTrack: ""
            }
        },
        onLoad () {
            this.getAttendanceToday();
            this.getAttendanceAll();
        },       
        onShow () {
            const status = uni.getStorageSync("isClockedIn");          
            if (status) {
                this.isClockedIn = true;
                this.buttonText = "Clock Out";
            }
        },
        mounted () {
            this.updateTime();
            console.log(this.timeTrack)
            setInterval(this.updateTime, 60000);
        },
        methods: {
            async getAttendanceToday () {
                const attendanceToday = await attendanceTodayRequest();
                console.log("result:", attendanceToday);
            },
            async getAttendanceAll () {
                const attendanceAll = await attendanceAllRequest();
                console.log("result:", attendanceAll);
            },
            updateTime () {
                const now = new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Sydney",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                this.timeTrack = now;
            },
            handleButtonClick() {
                if (this.isClockedIn) {
                    this.clockOut = true;
                    uni.hideTabBar();
                } else {
                    uni.navigateTo({ url: "/pages/home/clock-in" });
                }
            },
            onConfirm () {
                this.isClockedIn = false;
                this.buttonText = "Clock In Now";
                this.clockOut = false;
                uni.showTabBar();
                uni.removeStorageSync("isClockedIn");                
            },
            onCancle () {
                this.clockOut = false;
                uni.showTabBar();
            }
        }
    };
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
</style>