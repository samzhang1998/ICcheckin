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
                        <view class="card_info">
                            <text class="info_title">Leave Date</text>
                            <text class="info_data">{{ leave.leaveDate }}</text>
                        </view>
                        <view class="card_info">
                            <text class="info_title">Total Leave</text>
                            <text class="info_data">{{ leave.total }}</text>
                        </view>
                    </view>
                    <view class="review_info">
                        <view v-if="leave.review === 'pending'" class="review_status">
                            <image src="/static/Leave_pending.png"></image>
                            <text>Pending</text>
                        </view>
                        <view v-else class="review_status">
                            <image :src="leave.review === 'approved' ? '/static/Leave_approved.png' : '/static/Leave_rejected.png'"></image>
                            <text :style="{color: leave.review === 'approved' ? '#19B36E' : '#F95555'}">{{ leave.review }} at {{ leave.reviewDate }}</text>
                        </view>
                        <text v-if="leave.review !== 'pending'" class="review_by">By {{ leave.reviewBy }}</text>
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
    export default {
        components: { 
            workLeave,
            LeaveRequest,
            LeaveSubmitted
        },
        data () {
            return {
                activeTab: "review",
                date: "",
                leaveRequest: false,
                leaveSubmit: false,
                user: [
                    
                ],
                tabs: [
                    { label: "Review", value: "review" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" }
                ],
                leaves: [
                    {
                        leaveDate: "20 Sep - 22 Sep",
                        total: "32 Hours",
                        review: "rejected",
                        reviewDate: "19 Sept 2024",
                        reviewBy: "Elaine"
                    },
                    {
                        leaveDate: "05 Oct - 12 Oct",
                        total: "16 Hours",
                        review: "approved",
                        reviewDate: "19 Sept 2024",
                        reviewBy: "Elaine",                        
                    },
                    {
                        leaveDate: "20 Sep - 22 Sep",
                        total: "16 Hours",
                        review: "pending",
                        reviewDate: "",
                        reviewBy: ""
                    }
                ]
            }
        },
        mounted () {
            this.updateTime();
        },      
        computed: {
            filteredLeaves () {
                if (this.activeTab === "review") {
                    return this.leaves.sort(this.sortByDate);
                } else {
                    return this.leaves.filter(item => item.review === this.activeTab).sort(this.sortByDate);
                }
            }
        },
        methods: {
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
        height: 100vh;
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
    .card_info {
        display: flex;
        flex-direction: column;
        align-items: start;
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