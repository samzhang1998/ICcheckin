<template>
    <view class="home">
        <identity></identity>
        <working-hour 
            :period="period" 
            :isClockedIn="isClockedIn" 
            :buttonText="buttonText"
            @buttonClick="handleButtonClick"
        ></working-hour>
        <attendance :period="period"></attendance>
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
                period: 'Paid Period 1 Sept 2024 - 30 Sept 2024',
                buttonText: "Clock In Now",
                isClockedIn: false,
                today: "08:00:00 Hrs",
                overtime: "00:00:00 Hrs",
                clockOut: false
            }
        },
        onShow () {
            const status = uni.getStorageSync("isClockedIn");          
            if (status) {
                this.isClockedIn = true;
                this.buttonText = "Clock Out";
            }
        },
        methods: {
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