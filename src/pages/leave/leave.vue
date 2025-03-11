<template>
    <view class="leave">
        <identity></identity>
        <work-leave :date="date"></work-leave>
        <view class="filter">
            <view
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="selectTab(tab.value)"
                class="filter_opt"
                :class="activeTab === tab.value ? 'active' : ''"
            >{{ tab.label }}</view>
        </view>
        <view class="leave_info">
            <view v-if="filteredLeaves.length" class="leave_card">
                <text class="card_title">{{ date }}</text>
                <view 
                    v-for="(leave, index) in filteredLeaves" 
                    :key="index"
                    class="card_content"
                >
                    <view class="card_box">
                        <view class="card_info1">
                            <text class="info_title">Leave Date</text>
                            <text class="info_data">{{ leave.start }} - {{ leave.end }}</text>
                        </view>
                        <view class="card_info2">
                            <text class="info_title">{{ leave.requestType }}</text>
                            <text class="info_data">{{ leave.leaveHrs }}</text>
                        </view>
                    </view>
                    <view class="review_info">
                        <view v-if="leave.status === 'PENDING'" class="review_status">
                            <image src="/static/Leave_pending.png"></image>
                            <text>PENDING</text>
                        </view>
                        <view v-else class="review_status">
                            <image :src="leave.status === 'APPROVED' ? '/static/Leave_approved.png' : '/static/Leave_rejected.png'"></image>
                            <text :style="{color: leave.status === 'APPROVED' ? '#19B36E' : '#F95555'}">{{ leave.status }} at {{ leave.reviewDate }}</text>
                        </view>
                        <text v-if="leave.status !== 'PENDING'" class="review_by">By {{ leave.admin }}</text>
                    </view>
                </view>
            </view>
            <view v-else class="no_leave_card">
                <text class="card_title">Leave Submitted</text>
                <text class="card_sub_title">Leave information</text>
                <image src="/static/Leave_image.png" alt="no leave"></image>
                <text class="no_leave">No Leave Submitted</text>
            </view> 
            <button @click="addLeave">Submit Leave</button>
        </view>
        <leave-request
            :leaveRequest="leaveRequest"
            @cancelLeaveRequest="cancelLeaveRequest"
            @handleSubmit="handleSubmit"
        ></leave-request>
        <leave-submitted
            :leaveSubmit="leaveSubmit"
            @handleConfirm="handleConfirm"
        ></leave-submitted>
    </view>
</template>

<script>
    import workLeave from '@/components/leave/work-leave.vue'
    import LeaveRequest from '@/components/leave/leave-request.vue';
    import LeaveSubmitted from '@/components/leave/leave-submitted.vue';
    import { leaveInfoRequest } from '@/api/leave';
    export default {
        components: { 
            workLeave,
            LeaveRequest,
            LeaveSubmitted
        },
        data () {
            return {
                activeTab: "ALL",
                date: "",
                leaveRequest: false,
                leaveSubmit: false,
                request: [],
                tabs: [
                    { label: "Review", value: "ALL" },
                    { label: "Approved", value: "APPROVED" },
                    { label: "Rejected", value: "REJECTED" }
                ]
            }
        },
        mounted () {
            this.updateTime();
            this.getLeaveInfo();
        },      
        computed: {
            leaveOverview() {
                return this.request.map(item => ({
                    ...item,
                    reviewDate: this.formatDate(item.adminProcessingTimestamp),
                    start: this.formatTime(item.startTime),
                    end: this.formatTime(item.endTime),
                    leaveHrs: this.leaveHours(item.startTime, item.endTime)
                }));
            },            
            filteredLeaves () {
                if (this.activeTab === "ALL") {
                    return this.leaveOverview.sort(this.sortByDate);
                } else {
                    return this.leaveOverview.filter(item => item.status === this.activeTab).sort(this.sortByDate);
                }
            }
        },
        methods: {
            async getLeaveInfo () {
                try {
                    const res = await leaveInfoRequest();
                    if (res.statusCode === 200) {
                        this.request = res.data.data;
                        console.log("requests:", this.request);
                    } else {
                        console.log(res);
						uni.showToast({ title: "Faile to get your requests!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get your requests!", icon: "none" });
                }
            },
            formatTime (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
            },
            formatDate (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
            },
            leaveHours(startTime, endTime) {
                if (!startTime || !endTime) return "Invalid Time";
                const [startDay, startMonth, startYear] = startTime.split(" ")[0].split("-");
                const [endDay, endMonth, endYear] = endTime.split(" ")[0].split("-");                
                const [startHour, startMinute, startSecond] = startTime.split(" ")[1].split(":");
                const [endHour, endMinute, endSecond] = endTime.split(" ")[1].split(":");
                const startDate = new Date(`${startYear}-${startMonth}-${startDay}T${startHour}:${startMinute}:${startSecond}Z`);
                const endDate = new Date(`${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:${endSecond}Z`);
                const range = endDate - startDate;
                if (range < 0) return "Invalid Range";
                const totalMinutes = Math.floor(range / 60000);
                const hours = Math.floor(totalMinutes / 60);
                return `${hours} Hrs`;
            },
            updateTime () {
                const now = new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Sydney",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                this.date = now;
            },
            selectTab (value) {
                this.activeTab = value;
            },
            sortByDate (a, b) {
                if (a.review === "pending") return -1;
                if (b.review === "pending") return 1;
                return new Date(b.reviewDate) - new Date(a.reviewDate);
            },
            addLeave () {
                this.leaveRequest = true;
                uni.hideTabBar();
            },
            cancelLeaveRequest () {
                this.leaveRequest = false;
                uni.showTabBar();
            },
            handleSubmit () {
                this.leaveRequest = false;
                this.leaveSubmit = true;
            },
            handleConfirm () {
                this.leaveSubmit = false;
                uni.showTabBar();
            }
        }
    }
</script>

<style scoped>
    .leave {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background: linear-gradient(0deg, #F9F9F9 0%, #F9F9F9 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
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
    .leave_info {
        width: 100%;
        padding: 0 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }
    .leave_card {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        border-radius: 10px;
        background: #FFF;
    }
    .no_leave_card {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        background: #FFF;
    }
    .card_title {
        color: #101828;
        width: 100%;
        text-align: start;
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .card_sub_title {
        color: #667085;
        width: 100%;
        text-align: start;
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
    }
    .no_leave {
        color: #161B23;
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
    }
    .card_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .card_box {
        width: 90%;
        padding: 5%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        border: 1px solid var(--Color-Gray-Gray-200, #EAECF0);
        background: #F9FAFB;
    }
    .card_info1 {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5px;
    }
    .card_info2 {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 5px;
    }
    .info_title {
        color: #667085;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .info_data {
        color: #344054;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .review_info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .review_status {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 3px;
    }
    .review_status image {
        width: 16px;
        height: 16px;
    }
    .review_status text {
        font-size: 12px;
        font-weight: 500;
        line-height: 140%;
    }
    .review_by {
        color: #101828;
        font-size: 12px;
        font-weight: 700;
        line-height: 140%;
    }
    button {
	  display: flex;
	  width: 90%;
	  height: 48px;
	  padding: 12px 20px;
	  margin-bottom: 5%;
	  justify-content: center;
	  align-items: center;
	  gap: 10px;
	  flex-shrink: 0;
	  border-radius: 100px;
	  border: none;
	  background: #EFC462;
	  color: #fff;
	  text-align: center;
	  font-family: Nunito;
	  font-size: 16px;
	  font-style: normal;
	  font-weight: 600;
	  line-height: 20px;
	  letter-spacing: 0.1px;
    }
</style>