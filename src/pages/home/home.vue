<template>
    <view class="home">
        <view class="identity">
            <view class="identity_text">
                <text class="name">{{ name }}</text>
                <text class="role">{{ role }}</text>
            </view>
            <view class="img_box"><image src="/static/Bell_icon.png" alt="bell"></image></view>
        </view>
        <working-hour :period="period"></working-hour>
        <attendance :period="period"></attendance>
        <attendance-overview></attendance-overview>
        <attendance-history></attendance-history>
    </view>
</template>

<script>
    import WorkingHour from '@/components/home/working-hour.vue';
    import Attendance from '@/components/home/attendance.vue';
    import AttendanceOverview from '@/components/home/attendance-overview.vue';
    import AttendanceHistory from '@/components/home/attendance-history.vue';
    export default {
        components: {
            WorkingHour,
            Attendance,
            AttendanceOverview,
            AttendanceHistory
        },
        data () {
            return {
                name: 'Eniasls Nunito',
                role: 'UI/UX Designer',
                period: 'Paid Period 1 Sept 2024 - 30 Sept 2024',
            }
        },
        methods: {
            
        }
    };
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5%;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .identity {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
    }
    .img_box {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 1px solid #F1F1F1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .identity image {
        width: 24px;
        height: 24px;
    }
    .identity_text {
        display: flex;
        flex-direction: column;
    }
    .name {
        color: #141414;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.4px;
    }
    .role {
        color: #838383;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.4px;
    }
</style>