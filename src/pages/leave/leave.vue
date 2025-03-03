<template>
    <view class="leave">
        <identity></identity>
        <view class="work_leave">
            <text>Work Leave</text>
            <text>{{ period }}</text>
            <view class="leave_info">
                <view class="leave_box">
                    <view class="box_title">
                        <image src="/static/Clock_icon.png"></image>
                        <text>Available</text>
                    </view>
                    <text class="hrs">{{ availableHrs }}</text>
                </view>
                <view class="leave_box">
                    <view class="box_title">
                        <image src="/static/Clock_icon.png"></image>
                        <text>Leave used</text>
                    </view>
                    <text class="hrs">{{ usedHrs }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                period: "Paid Period 1 Sept 2024 - 1 Sept 2025",
                availableHrs: "132 Hours",
                usedHrs: "32 Hours"
            }
        }
    }
</script>

<style>

</style>