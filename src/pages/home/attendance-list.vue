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
        <input v-model="search" placeholder="Search"/>
        <view class="list">
            <text class="list_title">{{ attendance.departmentName }}</text>
            <view v-for="(item,index) in filteredList" :key="index" class="attendance_card">
                <view class="card_up">
                    <image :src="getImgSrc(item)" alt="check" class="check"></image>
                    <text class="member">{{ item.firstName }} {{ item.lastName }}</text>
                    <view class="time">
                        <text class="today">Today</text>
                        <text class="sign_in">{{ getTime(item) }}</text>
                    </view>
                </view>
                <view class="card_down">
                    <image :src="item.workFromHome ? '/static/home.png' : '/static/office.png'" alt="place" class="place"></image>
                    <text>{{ item.signInAddress }}</text>
                </view>
            </view>            
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                activeTab: "in",
                search: "",
                tabs: [
                    { label: "In", value: "in" },
                    { label: "Out", value: "out" },
                    { label: "Both", value: "both" }
                ],
                attendance: [],
                departmentName: "",
                lists: []
            }
        },
        onLoad (options) {
            if (options.data) {
                this.attendance = JSON.parse(decodeURIComponent(options.data));
                this.lists = this.attendance.attendances;
                console.log("department attendance:", this.lists);
            }
        },
        computed: {
            filteredList () {
                if (!this.search) return this.lists;
                return this.lists.filter(item =>
                    item.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.lastName.toLowerCase().includes(this.search.toLowerCase())
                );
            }            
        },
        methods: {
            goBack () {
                uni.switchTab({ url: "/pages/home/home" });
            },
            selectTab (value) {
                this.activeTab = value;
            },
            getImgSrc (item) {
                if (this.activeTab === "in") {
                    return item.signInTime ? "/static/checkedtrue.png" : "/static/checkedfalse.png";
                } else  {
                    return item.signOutTime ? "/static/checkedtrue.png" : "/static/checkedfalse.png";
                }
            },
            getTime (item) {
                if (this.activeTab === "in") {
                    return this.formatTime(item.signInTime);
                } else {
                    return this.formatTime(item.signOutTime);
                }
            },
            formatTime (time) {
                if (!time) return "not checked";
                return time.split("T")[1].split(":").slice(0, 2).join(":");
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
    .member {
        flex: 1;
        color: #141414;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.28px;
    }
    .check {
        width: 30px;
        height: 30px;
    }
    .time {
        flex: 0.3;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .today {
        color: var(--Color, #141414);
        font-size: 14px;
        font-weight: 400;
        letter-spacing: -0.24px;
    }
    .sign_in {
        color: #838383;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: -0.2px;
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
    .card_down text {
        color: #4A4A4A;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: -0.24px;
    }
    .place {
        width: 25px;
        height: 25px;
    }
</style>