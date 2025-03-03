<template>
    <view class="attendance_list">
        <view class="title">
            <image src="/static/back_icon.png" alt="back" @click="goBack"></image>
            <text>Attendance Overview</text>
        </view>
        <view class="filter">
            <view
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="selectTab(tab.value)"
                class="filter_opt"
                :class="activeTab === tab.value ? 'active' : ''"
            >{{ tab.label }}</view>
        </view>
        <input placeholder="Search"/>
        <view class="list">
            <text class="list_title">{{ group }}</text>
            <view v-for="(item,index) in list" :key="index" class="attendance_card">
                <view class="card_up">
                    <image :src="item.isCheckedIn ? '/static/checkedtrue.png' : '/static/checkedfalse.png'" alt="check" class="check"></image>
                    <view class="member">
                        <text>{{ item.name }}</text>
                        <text>{{ item.role }}</text>
                    </view>
                    <view class="time">
                        <text>Today</text>
                        <text>{{ item.time }}</text>
                    </view>
                </view>
                <view class="card_down">
                    <image :src="item.workFromHome ? '/static/home.png' : '/static/office.png'" alt="place" class="place"></image>
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
                activeTab: "in",
                tabs: [
                    { label: "In", value: "in" },
                    { label: "Out", value: "out" },
                    { label: "Both", value: "both" }
                ],
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
                        address: "327 Pitt Street, Sydney NSW 2000",
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
        methods: {
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
            },
            selectTab(value) {
                this.activeTab = value;
            }
        }
    }
</script>

<style scoped>
    .attendance_list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background:linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .title {
        width: 100%;
        height: 100px;
        background: #fff;
        border-bottom: 1px solid #DADADA;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
    }
    .title image {
        width: 36px;
        height: 36px;
        position: absolute;
        left: 5%;
    }
    .title text {
        color: #101828;
        font-size: 18px;
        font-weight: 700;
        line-height: 140%;
        text-align: center;
    }
    .filter {
        width: 90%;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 100px;
        background: #FEFEFE;
    }
    .filter_opt {
        flex: 1;
        height: 32px;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        line-height: 140%;
    }
    .active {
        background: #EFC462;
        color: white;
    }
    input {
        width: 80%;
        height: 46px;
        padding: 0 5%;
        font-size: 16px;
        font-weight: 500;
        border-radius: 39px;
        border: 1px solid #DADADA;
    }
    .list {
        width: 84%;
        padding: 3%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        border-radius: 8px;
        background: #FFF;
    }
    .list_title {
        color: #2B2B2B;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .attendance_card {
        width: 94%;
        padding: 3%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 8px;
        border: 1px solid #EAECF0;
        background: #FBFBFB;
    }
    .card_up {
        width: 100%;
        padding-bottom: 3%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 5px;
        align-items: center;
        border-bottom: 1px solid #F0F0F0;
    }
    .check {
        width: 30px;
        height: 30px;
    }
    .member {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .time {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .card_down {
        width: 100%;
        padding-top: 3%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .place {
        width: 25px;
        height: 25px;
    }
</style>