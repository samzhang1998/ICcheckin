<template>
    <view class="my-page">
        <attendance-tracking />
    </view>
</template>

<script>
import AttendanceTracking from '@/components/profile/attendance-tracking.vue';

export default {
    components: {
        AttendanceTracking
    }
}
</script>

<style>
.my-page {
    background-color: #FFFFFF;
    min-height: 100vh;
}
</style>