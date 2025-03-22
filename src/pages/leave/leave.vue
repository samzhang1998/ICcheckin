<template>
    <view class="leave">
        <identity :user="user"></identity>
        <work-leave :leave="leave"
            :selectedType="selectedType"
            :leaveInfo="leaveInfo"
            :date="date"
            :user="user"
            @changeLeave="changeLeave"
            @selectType="selectType"
        ></work-leave>      
        <view class="user_leave" v-if="user.role[0] === 'EMPLOYEE'">
            <view class="filter">
                <view
                    v-for="(tab, index) in tabs" 
                    :key="index" 
                    @click="selectTab(tab.value)"
                    class="filter_opt"
                    :class="activeTab[0] === tab.value[0] ? 'active' : ''"
                >{{ tab.label }}</view>
            </view>
            <view class="leave_info">
                <view v-if="filteredLeaves.length" class="leave_card">
                    <view 
                        v-for="(leave, index) in filteredLeaves" 
                        :key="index"
                        class="card_content"
                        @click="showLeave(leave)"
                    >
                        <text class="card_title">{{ leave.requestDate }}</text>
                        <view class="card_box">
                            <view class="card_info1">
                                <text class="info_title">Leave Date</text>
                                <text class="info_data">{{ leave.start }} - {{ leave.end }}</text>
                            </view>
                            <view class="card_info2">
                                <text class="info_title">{{ leave.requestType }}</text>
                                <text class="info_data">{{ Math.round(leave.requestedHours * 10) / 10 }} Hrs</text>
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
            </view>            
        </view>
        <view class="user_leave" v-else>
            <admin-leave :reloadTrigger="reloadTrigger" :systemInfo="systemInfo"></admin-leave>
        </view>
        <button @click="addLeave" v-if="user.role[0] !== 'ADMIN'">Submit Leave</button>
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
    import AdminLeave from '@/components/leave/admin-leave.vue';
    import { leaveInfoRequest, leaveBalanceRequest } from '@/api/leave';
    export default {
        components: { 
            workLeave,
            LeaveRequest,
            LeaveSubmitted,
            Identity,
            AdminLeave
        },
        data () {
            return {
                reloadTrigger: false,
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    token:"",
                    department:"",
                    title:"",
                    role:"" 
                },
                activeTab: ["PENDING", "WAITING_CANCELLATION_CONFIRMATION"],
                leaveRequest: false,
                leaveSubmit: false,
                request: [],
                tabs: [
                    { label: "Review", value: ["PENDING", "WAITING_CANCELLATION_CONFIRMATION"] },
                    { label: "Approved", value: ["APPROVED"] },
                    { label: "Rejected", value: ["REJECTED", "CANCELLED"] }
                ],
                leave: false,
                selectedType: {},
                leaveInfo: [],
                date: "",
                systemInfo:null,
            }
        },   
        onLoad(){
            this.systemInfo = uni.getSystemInfoSync();
        },  
        computed: {
            leaveOverview() {
                return this.request.map(item => ({
                    ...item,
                    requestDate: this.formatDate(item.requestTimestamp),
                    reviewDate: this.formatDate(item.adminProcessingTimestamp),
                    start: this.formatTime(item.startTime),
                    end: this.formatTime(item.endTime),
                }));
            },            
            filteredLeaves () {
                return this.leaveOverview.filter(item =>
                    Array.isArray(this.activeTab) ? this.activeTab.includes(item.status) : item.status === this.activeTab
                ).sort(this.sortByDate);
            }
        },
        methods: {
            getUserInfo() {
                this.user.token = uni.getStorageSync("token");  
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return 
                };
                this.user.firstName = uni.getStorageSync("firstName");
                this.user.lastName = uni.getStorageSync("lastName");
                this.user.department = uni.getStorageSync("department");
                this.user.title = uni.getStorageSync("title");
                this.user.role = uni.getStorageSync("role");
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
                if (this.systemInfo.platform === 'android') {
                    return `${parts[2]} ${parts[1]}`;
                } else   {
                    return `${parts[0]} ${parts[1]}`
                 
                } 
            },
            formatDate (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                const parts = date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }).split(" ");
                if (this.systemInfo.platform === 'android') {
                    return `${parts[2]} ${parts[1]} ${parts[3]}`;
                } else if (this.systemInfo.platform === 'ios') {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                } else {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                }                
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
                const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				uni.reLaunch({
					url: '/' + currentPage.route
				});
                uni.showTabBar();
            },
            showLeave (leave) {
                uni.setStorageSync("requestData", leave);
                uni.navigateTo({
                    url: `/pages/manager/detail`  
                });
            }
        },
        onShow () {
            this.getUserInfo();
            if (this.user.role[0] === "ADMIN") {
                this.reloadTrigger = !this.reloadTrigger;
            } else {
                this.getLeaveInfo();
                this.updateDate();
                this.getLeaveBalance();
            }
        }
    }
</script>

<style scoped lang="scss">
    .leave {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
    }
    .user_leave {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
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
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        text-align: start;
        font-size: 30rpx;
        font-weight: 600;
        line-height: 140%;
    }
    .card_sub_title {
        color: #667085;
        width: 600rpx;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        text-align: start;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 140%;
    }
    .no_leave {
        color: #161B23;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
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
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 22rpx;
        font-weight: 500;
        letter-spacing: -0.5px;
    }
    .info_data {
        color: #344054;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
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
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
        font-size: 22rpx;
        font-weight: 500;
        line-height: 140%;
    }
    .review_by {
        color: #101828;
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
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