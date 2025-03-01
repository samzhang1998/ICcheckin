<template>
    <view class="attendance_list">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>Attendance Overview</text>
        </view>
        <view class="filter">
            <view class="filter_opt"><text>In</text></view>
            <view class="filter_opt"><text>Out</text></view>
            <view class="filter_opt"><text>Both</text></view>
        </view>
        <input />
        <view class="list">
            <text>{{ group }}</text>
            <view v-for="(item,index) in list" :key="index" class="attendance_card">
                <image src="checkImg"></image>
                <view class="member">
                    <text>{{ item.name }}</text>
                    <text>{{ item.role }}</text>
                </view>
                <view>
                    <text>Today</text>
                    <text>{{ item.time }}</text>
                </view>
                <view>
                    <image src="addressImg"></image>
                    <text>{{ item.address }}</text>
                </view>
            </view>            
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                group: "Sales/IT/Management (12/15)",
                checkImg: "",
                addressImg: "",
                list: [
                    {
                        name: "SW Wang",
                        role: "Marketing Assistance",
                        time: "09:22 am",
                        address: "327 Pitt Street, Sydney NSW 2000",
                        isCheckedIn: true,
                        workFromHome: false
                    },
                    {
                        name: "Zoey",
                        role: "Project Manager",
                        time: "09:30 am",
                        address: "321 Pitt Street, Sydney NSW 2000",
                        isCheckedIn: true,
                        workFromHome: true
                    },
                    {
                        name: "Olivia",
                        role: "Sales",
                        time: "09:45 am",
                        address: "327 Pitt Street Street, Sydney NSW 2000",
                        isCheckedIn: false,
                        workFromHome: true
                    },
                    {
                        name: "Sam",
                        role: "IT Support",
                        time: "09:50 am",
                        address: "219 Walker Street, Rhodes NSW 2138",
                        isCheckedIn: false,
                        workFromHome: true
                    }
                ]
            }
        },
        onLoad (options) {
            if (options.isCheckedIn === "true") {
                this.checkImg = "/static/checkedtrue.png";
            } else {
                this.checkImg = "/static/checkedfalse.png";
            };
            if (options.workFromHome === "true") {
                this.addressImg = "/static/home.png";
            } else {
                this.addressImg = "/static/office.png"
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>