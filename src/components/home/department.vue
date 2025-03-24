<template>
    <view class="attendance_overview">
        <text class="title">Attendance Overview</text>
        <view class="site_card">
            <view v-for="(item, index) in sites" :key="index" class="sites">
                <view class="site_title">
                    <text class="site_no">{{ item.departmentName }}</text>
                    <view class="site_time">
                        <image src="/static/Clock_icon.png" alt="clock"></image>
                        <text>{{ scheduleStart }} - {{ scheduleEnd }}</text>
                    </view>
                </view>
                <view class="site_detail">
                    <view class="site_member">
                        <text>Total member: {{ item.departmentEmployee }}, online: {{ item.onlineEmployee }}</text>
                    </view>
                    <button @click="showAttendance(item)">View Details</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "Department",
        props: {
            sites: Array,
            scheduleStart: String,
            scheduleEnd: String
        },
        data () {
            return {         
                selectedSite: ""
            }
        },
        methods: {
            showAttendance (item) {
                this.selectedSite = item;                
                if (!item || item.length === 0) {
                    console.warn("No attendance data");
                    return;
                }
                uni.navigateTo({ url: `/pages/home/attendance-list?data=${encodeURIComponent(JSON.stringify(item))}` });
            }
        }
    }
</script>

<style scoped lang="scss">
    .attendance_overview {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30rpx;
        border-radius: 10px;
        background: #FEFEFE;
    }
    .title {
        color: #101828;
        font-family: Nunito;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .site_card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 30rpx;
    }
    .sites {
        width: 540rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 10px;
        padding: 30rpx;
        border-radius: 12px;
        border: 1px solid #DADADA;
        background: #FBFBFB;
    }
    .site_title {
        width: 540rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .site_no {
        color: #2B2B2B;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_time {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: 10rpx;
    }
    .site_time image {
        width: 30rpx;
        height: 30rpx;
    }
    .site_time text {
        color: #475467;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_detail {
        width: 540rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .site_member {
        height: 40rpx;
        padding: 5rpx 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #DADADA;
        background: #FEFEFD;
    }
    .site_member text {
        color: #838383;
        font-family: Nunito;
        font-size: 18rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .site_detail button {
        height: 50rpx;
        padding: 5rpx 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 80px;
        background: #EFC462;
        color: #FFF;
        font-family: Nunito;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
        margin: 0;
    }
</style>