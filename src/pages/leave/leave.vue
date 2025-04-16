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
                    <view class="maintitle">
                        <view class="titletype">Leave {{activeTab| statustitle}}</view>
                        <view class="titlemsg"> Leave information</view>
                    </view>                    
                    <view 
                        v-for="(leave, index) in filteredLeaves" 
                        :key="index"
                        class="card_content"
                        @click="showLeave(leave)"
                    >
                        <view class="l-header">
                            <view class="l-left">
                                <view class="l-title">{{ leave.requestType }}</view>
                                <view class="l-dates">  {{ leave.start }} - {{ leave.end }} </view>
                            </view>
                            <view class="status status-pending" v-if="leave.status === 'PENDING' || leave.status === 'WAITING_CANCELLATION_CONFIRMATION'">
                                {{ statustxt2(leave.status) }}
                            </view>
                            <view class="status status-approve" v-if="leave.status === 'APPROVED'">
                                {{ statustxt2(leave.status) }}
                            </view>
                            <view class="status status-reject" v-if="leave.status === 'REJECTED' || leave.status === 'CANCELLED'">
                                {{ statustxt2(leave.status) }}
                            </view>
                        </view>
                        <view class="l-details">
                            <view class="item">
                                <view class="l-title">Apply Date</view>
                                <view class="l-dates">{{ leave.requestDate }}</view>
                            </view>
                            <view class="item">
                                <view class="l-title">Balance used</view>
                                <view class="l-dates">{{Math.round(leave.requestedHours * 10) / 10 }} Hrs</view>
                            </view>
                            <view class="item">
                                <view class="l-title">{{ leave.status | statustxt}}</view>
                                <view class="l-dates">{{ leave.admin || "Admin"}}</view>
                            </view>
                        </view> 
                    </view>
                </view>
                <view v-else class="no_leave_card">
                    <text class="card_title">Leave </text>
                    <text class="card_sub_title">Leave information</text>
                    <image src="/static/Leave_image.png" alt="no leave" mode="aspectFill"></image>
                    <text class="no_leave">No Leave </text>
                </view>                
            </view>            
        </view>
        <view class="user_leave" v-else>
            <admin-leave :reloadTrigger="reloadTrigger" :systemInfo="systemInfo" :user="user"></admin-leave>
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
                    role:"" ,
                    id: ""
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
        filters:{
            statustxt(status){
                let txt =""
                if(status == "PENDING" || status == "WAITING_CANCELLATION_CONFIRMATION"){
                    txt = "Submit to"
                }else if(status == "APPROVED"){
                    txt = "Approved By"
                }else if(status == "REJECTED" || status == "CANCELLED" ){
                    txt = "Reject By"
                }                
                return txt 
            },
            statustitle (status) { 
                console.log(status)
                let txt =""
                if (status.includes("PENDING") || status.includes("WAITING_CANCELLATION_CONFIRMATION")) {
                    txt = "Pending"
                } else if (status.includes("APPROVED")) {
                    txt = "Approve"
                } else if (status.includes("REJECTED")) {
                    txt = "Reject"
                }                
                return txt 
            }
        },
        onLoad () {
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
                this.user.id = uni.getStorageSync("id");
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
                    return `${parts[2]} ${parts[1]}  ${year}` ;
                } else   {
                    return `${parts[0]} ${parts[1]}  ${year}` 
                 
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
                console.log("llddddddddddddd")
                console.log( leave )
                console.log(JSON.stringify(leave) )
                uni.navigateTo({
                    url: `/pages/manager/detail?data=`+JSON.stringify(leave)  
                });
            },
            statustxt2 (status) {
                let txt =""
                if (status === "PENDING") {
                    txt = "Pending"
                } else if (status === "APPROVED") {
                    txt = "Approved"
                } else if (status === "REJECTED") {
                    txt = "Rejected"
                } else if (status === "CANCELLED") {
                    txt = "Cancelled"
                } else if (status === "WAITING_CANCELLATION_CONFIRMATION") {
                    txt = "Cancelling"
                }                
                return txt 
            }
        },
        onShow () {
            this.getUserInfo();
            if (this.user.role[0] === "ADMIN") {
                this.reloadTrigger = !this.reloadTrigger;
                uni.setTabBarItem({
                    index:0,
                    pagePath:"/pages/home/adminhome",
                })
                uni.setTabBarItem({
                    index:1,
                    visible:true,
                })
            } else if (this.user.role[0] === "MANAGER") {
                this.reloadTrigger = !this.reloadTrigger;
                this.updateDate();
                this.getLeaveBalance();
                uni.setTabBarItem({
                    index:1,
                    pagePath:"/pages/home/manager-attendance",
                })
            } else {
                this.getLeaveInfo();
                this.updateDate();
                this.getLeaveBalance();
                uni.setTabBarItem({
                    index:1,
                    visible:false,
                }) 
            }
            uni.showTabBar()
        }
    }
</script>

<style scoped lang="scss" src="./leave.scss">
    
</style>