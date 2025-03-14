<template>
    <view class="leave">
        <identity :user="user"></identity>
        <work-leave :leave="leave"
            :selectedType="selectedType"
            :leaveInfo="leaveInfo"
            :date="date"
            @changeLeave="changeLeave"
            @selectType="selectType"
        ></work-leave>
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
                <view 
                    v-for="(leave, index) in filteredLeaves" 
                    :key="index"
                    class="card_content"
                >
                    <text class="card_title">{{ leave.requestDate }}</text>
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
    import Identity from '@/components/main/identity.vue';
    import { leaveInfoRequest, leaveBalanceRequest } from '@/api/leave';
    export default {
        components: { 
            workLeave,
            LeaveRequest,
            LeaveSubmitted,
            Identity
        },
        data () {
            return {
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    department:"",
                    title:"",
                    role:"" 
                },
                activeTab: "PENDING",
                leaveRequest: false,
                leaveSubmit: false,
                request: [],
                tabs: [
                    { label: "Review", value: "PENDING" },
                    { label: "Approved", value: "APPROVED" },
                    { label: "Rejected", value: "REJECTED" }
                ],
                leave: false,
                selectedType: {},
                leaveInfo: [],
                date: ""
            }
        },     
        computed: {
            leaveOverview() {
                return this.request.map(item => ({
                    ...item,
                    requestDate: this.formatDate(item.requestTimestamp),
                    reviewDate: this.formatDate(item.adminProcessingTimestamp),
                    start: this.formatTime(item.startTime),
                    end: this.formatTime(item.endTime),
                    leaveHrs: this.leaveHours(item.startTime, item.endTime)
                }));
            },            
            filteredLeaves () {
                return this.leaveOverview.filter(item => item.status === this.activeTab).sort(this.sortByDate);
            }
        },
        methods: {
            getUserInfo() {
                this.user.firstName = uni.getStorageSync("firstName");
                this.user.lastName = uni.getStorageSync("lastName");
                this.user.department = uni.getStorageSync("department");
                this.user.title = uni.getStorageSync("title");
            },
            async getLeaveBalance () {
                try {
                    const res = await leaveBalanceRequest();
                    if (res.statusCode === 200) {
                        this.leaveInfo = res.data.data;
                        console.log("Leave balance:", this.leaveInfo);
                        const defaultLeave = this.leaveInfo.find(type => type.leaveTypeName === "ANNUAL");
                        if (defaultLeave) {this.selectedType = defaultLeave;}                
                    } else if (res.statusCode === 400) {
                        console.log("Failed get:", res);
                        uni.showToast({ title: "Invalid user ID!", icon: "none" });
                    } else {
                        console.log("Error:", res);
                        uni.showToast({ title: "Cannot get your leave balance!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Cannot get your leave balance!", icon: "none" });
                }
            },
            changeLeave () {
                this.leave = !this.leave;
            },
            selectType (type) {
                this.selectedType = type;
                this.leave = false;
            },
            updateDate () {
                this.date = new Date().toLocaleDateString("en-AU", {
                    timeZone: "Australia/Sydney",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
            },
            async getLeaveInfo () {
                try {
                    const res = await leaveInfoRequest();
                    if (res.statusCode === 200) {
                        console.log("response leave:", res.data.data);
                        this.request = res.data.data;
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to get your requests!", icon: "none" });
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
                const parts = date.toLocaleDateString("en-AU", { day: "numeric", month: "short" }).split(" ");
                return `${parts[2]} ${parts[1]}`;
            },
            formatDate (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                const parts = date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }).split(" ");
                return `${parts[2]} ${parts[1]} ${parts[3]}`;
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
            selectTab (value) {
                this.activeTab = value;
            },
            sortByDate (a, b) {
                if (a.review === "pending") return -1;
                if (b.review === "pending") return 1;
                return new Date(b.requestDate) - new Date(a.requestDate);
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
        },
        onShow () {
            this.getLeaveInfo();
            this.getUserInfo();
            this.updateDate();
            this.getLeaveBalance();
        }
    }
</script>

<style scoped>
    .leave {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .filter {
        width: 675rpx;
        height: 60rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 100px;
        background: #FEFEFE;
    }
    .filter_opt {
        flex: 1;
        height: 60rpx;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 22rpx;
        font-weight: 500;
        line-height: 140%;
    }
    .active {
        background: #EFC462;
        color: white;
    }
    .leave_info {
        width: 750rpx;
        padding: 0 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 30rpx;
    }
    .leave_card {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        border-radius: 10px;
        background: #FFF;
        margin-bottom: 30rpx;
    }
    .no_leave_card {
        width: 600rpx;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        background: #FFF;
        margin-bottom: 30rpx;
    }
    .card_title {
        color: #101828;
        width: 600rpx;
        text-align: start;
        font-size: 30rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .card_sub_title {
        color: #667085;
        width: 600rpx;
        text-align: start;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .no_leave {
        color: #161B23;
        font-size: 26rpx;
        font-weight: 600;
        line-height: 24px;
    }
    .card_content {
        width: 600rpx;
        display: flex;
        flex-direction: column;
        gap: 10rpx;
    }
    .card_box {
        width: 540rpx;
        padding: 30rpx;
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
        gap: 20rpx;
    }
    .card_info2 {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 20rpx;
    }
    .info_title {
        color: #667085;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .info_data {
        color: #344054;
        font-size: 30rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .review_info {
        width: 600rpx;
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
        gap: 10rpx;
    }
    .review_status image {
        width: 30rpx;
        height: 30rpx;
    }
    .review_status text {
        font-size: 22rpx;
        font-weight: 500;
        line-height: 140%;
    }
    .review_by {
        color: #101828;
        font-size: 22rpx;
        font-weight: 700;
        line-height: 140%;
    }
    button {
	  display: flex;
	  width: 675rpx;
	  height: 85rpx;
	  position: sticky;
      bottom: 30rpx;
      z-index: 100;
	  justify-content: center;
	  align-items: center;
	  flex-shrink: 0;
	  border-radius: 100px;
	  border: none;
	  background: #EFC462;
	  color: #fff;
	  text-align: center;
	  font-family: Nunito;
	  font-size: 30rpx;
	  font-style: normal;
	  font-weight: 600;
	  line-height: 20px;
	  letter-spacing: 0.1px;
    }
</style>